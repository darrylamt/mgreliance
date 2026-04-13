-- Properties table
create table properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text check (type in ('residential', 'commercial', 'land')) not null,
  location text not null,
  price text,
  description text,
  status text check (status in ('available', 'sold', 'rented')) default 'available',
  images text[] default '{}',
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Blog posts table
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image_url text,
  category text,
  published boolean default false,
  published_at timestamptz,
  author text default 'MG Reliance',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contact submissions table
create table contact_submissions (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- RLS Policies
alter table properties enable row level security;
alter table posts enable row level security;
alter table contact_submissions enable row level security;

-- Public can read published posts and available properties
create policy "Public can view properties" on properties for select using (true);
create policy "Public can view published posts" on posts for select using (published = true);

-- Authenticated users (admin) can do everything
create policy "Admin full access to properties" on properties for all using (auth.role() = 'authenticated');
create policy "Admin full access to posts" on posts for all using (auth.role() = 'authenticated');
create policy "Admin full access to submissions" on contact_submissions for all using (auth.role() = 'authenticated');

-- Anyone can insert contact submissions
create policy "Anyone can submit contact form" on contact_submissions for insert with check (true);

-- Updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply triggers
create trigger update_properties_updated_at
  before update on properties
  for each row execute function update_updated_at_column();

create trigger update_posts_updated_at
  before update on posts
  for each row execute function update_updated_at_column();
