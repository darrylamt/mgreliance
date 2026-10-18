-- ─── Readable property URLs ────────────────────────────────────────────────
alter table properties add column if not exists slug text;

create or replace function slugify(value text)
returns text as $$
  select trim(both '-' from left(
    regexp_replace(lower(coalesce(value, '')), '[^a-z0-9]+', '-', 'g'),
    80
  ));
$$ language sql immutable;

-- Assign a unique slug when one isn't provided. Slugs never change afterwards,
-- so links that have already been shared keep working after a title edit.
create or replace function set_property_slug()
returns trigger as $$
declare
  base text;
  candidate text;
  n int := 1;
begin
  if new.slug is not null and new.slug <> '' then
    new.slug := slugify(new.slug);
  end if;
  if new.slug is null or new.slug = '' then
    if tg_op = 'UPDATE' and old.slug is not null and old.slug <> '' then
      new.slug := old.slug;
      return new;
    end if;
    base := coalesce(nullif(slugify(new.title), ''), 'property');
    candidate := base;
    while exists (select 1 from properties where slug = candidate and id <> new.id) loop
      n := n + 1;
      candidate := base || '-' || n;
    end loop;
    new.slug := candidate;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_property_slug on properties;
create trigger set_property_slug
  before insert or update on properties
  for each row execute function set_property_slug();

-- Backfill existing rows (the trigger fills slug when it's null).
update properties set slug = null where slug is null;

create unique index if not exists properties_slug_key on properties (slug);

-- ─── New-listing email alerts ──────────────────────────────────────────────
create table if not exists listing_alerts (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  type text check (type in ('residential', 'commercial', 'land')),
  status text check (status in ('available', 'rented', 'sold')),
  location text,
  token uuid not null default gen_random_uuid() unique,
  active boolean not null default true,
  created_at timestamptz default now()
);

create index if not exists listing_alerts_active_idx on listing_alerts (active);

-- Only the server (service role) writes alerts; signed-in admins can read them.
alter table listing_alerts enable row level security;
drop policy if exists "Admin can read alerts" on listing_alerts;
create policy "Admin can read alerts" on listing_alerts for select using (auth.role() = 'authenticated');
