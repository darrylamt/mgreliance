-- Link submissions to a property (already present in production; kept here so a fresh DB matches)
alter table contact_submissions
  add column if not exists property_id uuid references properties(id) on delete set null;

-- What kind of submission this is: general contact form, property enquiry, or viewing request
alter table contact_submissions
  add column if not exists kind text not null default 'contact'
  check (kind in ('contact', 'enquiry', 'viewing'));

-- Requested viewing slot (only set when kind = 'viewing')
alter table contact_submissions
  add column if not exists viewing_date date,
  add column if not exists viewing_time text;

-- Backfill: anything already tied to a property was a property enquiry
update contact_submissions set kind = 'enquiry' where property_id is not null and kind = 'contact';
