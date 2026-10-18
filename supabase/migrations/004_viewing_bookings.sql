-- ─── Viewing booking status ────────────────────────────────────────────────
alter table contact_submissions
  add column if not exists viewing_status text not null default 'pending'
  check (viewing_status in ('pending', 'confirmed', 'cancelled', 'completed'));

-- A property can't have two active bookings in the same slot (guards against two
-- visitors grabbing the same time at once). Cancelled bookings free the slot.
create unique index if not exists viewing_slot_taken
  on contact_submissions (property_id, viewing_date, viewing_time)
  where kind = 'viewing' and viewing_status in ('pending', 'confirmed');

-- ─── Admin block-offs (holidays, busy days) ───────────────────────────────
-- time null = the whole day is blocked. Applies to every property.
create table if not exists viewing_blocks (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  time text,
  reason text,
  created_at timestamptz default now()
);

create unique index if not exists viewing_blocks_slot
  on viewing_blocks (date, coalesce(time, ''));

alter table viewing_blocks enable row level security;
drop policy if exists "Admin full access to viewing blocks" on viewing_blocks;
create policy "Admin full access to viewing blocks" on viewing_blocks
  for all using (auth.role() = 'authenticated');
