-- =====================================================================
-- South Canara Real Estate — Database Schema
-- Run this once in the Supabase SQL Editor on a fresh project.
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS guards.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------
do $$ begin
  create type property_status as enum ('upcoming', 'ongoing', 'ready_to_move', 'sold_out');
exception when duplicate_object then null; end $$;

do $$ begin
  create type property_type as enum ('apartment', 'villa', 'plot', 'commercial', 'row_house');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum (
    'new', 'contacted', 'interested', 'site_visit_scheduled',
    'negotiation', 'converted', 'closed'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- TABLE: properties
-- ---------------------------------------------------------------------
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  location text not null,
  city text not null,
  price numeric(14, 2) not null check (price >= 0),
  price_display text,
  property_type property_type not null default 'apartment',
  status property_status not null default 'upcoming',
  area_sqft numeric(10, 2) not null check (area_sqft >= 0),
  bedrooms smallint check (bedrooms >= 0),
  bathrooms smallint check (bathrooms >= 0),
  possession_date date,
  latitude double precision,
  longitude double precision,
  featured boolean not null default false,
  published boolean not null default false,
  brochure_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_properties_published on properties (published);
create index if not exists idx_properties_featured on properties (featured) where featured = true;
create index if not exists idx_properties_city on properties (city);
create index if not exists idx_properties_status on properties (status);
create index if not exists idx_properties_slug on properties (slug);

-- ---------------------------------------------------------------------
-- TABLE: property_images  (also used for floor plans via is_floor_plan)
-- ---------------------------------------------------------------------
create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties (id) on delete cascade,
  image_url text not null,
  alt_text text,
  display_order smallint not null default 0,
  is_floor_plan boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_property_images_property_id on property_images (property_id);

-- ---------------------------------------------------------------------
-- TABLE: amenities (shared catalog)
-- ---------------------------------------------------------------------
create table if not exists amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text not null default 'Check'
);

-- ---------------------------------------------------------------------
-- TABLE: property_amenities (join table)
-- ---------------------------------------------------------------------
create table if not exists property_amenities (
  property_id uuid not null references properties (id) on delete cascade,
  amenity_id uuid not null references amenities (id) on delete cascade,
  primary key (property_id, amenity_id)
);

-- ---------------------------------------------------------------------
-- TABLE: leads
-- ---------------------------------------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties (id) on delete set null,
  name text not null check (char_length(trim(name)) between 2 and 120),
  phone text not null check (char_length(trim(phone)) between 7 and 20),
  email text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text check (message is null or char_length(message) <= 2000),
  interested_in_site_visit boolean not null default false,
  source text not null default 'website',
  status lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_status on leads (status);
create index if not exists idx_leads_property_id on leads (property_id);
create index if not exists idx_leads_created_at on leads (created_at desc);

-- ---------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_properties_updated_at on properties;
create trigger trg_properties_updated_at
  before update on properties
  for each row execute function set_updated_at();

drop trigger if exists trg_leads_updated_at on leads;
create trigger trg_leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Seed a starter amenities catalog (icon = lucide-react icon name)
-- ---------------------------------------------------------------------
insert into amenities (name, icon) values
  ('Swimming Pool', 'Waves'),
  ('Gymnasium', 'Dumbbell'),
  ('Covered Parking', 'CircleParking'),
  ('24x7 Security', 'ShieldCheck'),
  ('Garden', 'Trees'),
  ('Clubhouse', 'Building2'),
  ('Children''s Play Area', 'Baby'),
  ('Power Backup', 'Zap'),
  ('Lift', 'ArrowUpDown'),
  ('Rainwater Harvesting', 'CloudRain')
on conflict (name) do nothing;

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table properties enable row level security;
alter table property_images enable row level security;
alter table amenities enable row level security;
alter table property_amenities enable row level security;
alter table leads enable row level security;

-- properties: public can read only published rows; admins (any
-- authenticated user) can read/write everything.
drop policy if exists "public read published properties" on properties;
create policy "public read published properties"
  on properties for select
  to anon, authenticated
  using (published = true);

drop policy if exists "admin full access properties" on properties;
create policy "admin full access properties"
  on properties for all
  to authenticated
  using (true)
  with check (true);

-- property_images: readable if the parent property is published, or if
-- the requester is an authenticated admin.
drop policy if exists "public read images of published properties" on property_images;
create policy "public read images of published properties"
  on property_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from properties p
      where p.id = property_images.property_id and p.published = true
    )
  );

drop policy if exists "admin full access property_images" on property_images;
create policy "admin full access property_images"
  on property_images for all
  to authenticated
  using (true)
  with check (true);

-- amenities: catalog is public read, admin-managed.
drop policy if exists "public read amenities" on amenities;
create policy "public read amenities"
  on amenities for select
  to anon, authenticated
  using (true);

drop policy if exists "admin manage amenities" on amenities;
create policy "admin manage amenities"
  on amenities for all
  to authenticated
  using (true)
  with check (true);

-- property_amenities: same visibility rule as property_images.
drop policy if exists "public read amenities of published properties" on property_amenities;
create policy "public read amenities of published properties"
  on property_amenities for select
  to anon, authenticated
  using (
    exists (
      select 1 from properties p
      where p.id = property_amenities.property_id and p.published = true
    )
  );

drop policy if exists "admin manage property_amenities" on property_amenities;
create policy "admin manage property_amenities"
  on property_amenities for all
  to authenticated
  using (true)
  with check (true);

-- leads: THIS IS THE SENSITIVE TABLE.
-- The public must be able to INSERT an enquiry (submit a form) but must
-- NEVER be able to SELECT/UPDATE/DELETE leads — that would leak every
-- customer's contact details to every website visitor.
-- Enquiry submission goes through a Server Action using the anon key,
-- so the INSERT policy below is what allows it — no service role needed
-- for the public-facing form.
drop policy if exists "public can submit leads" on leads;
create policy "public can submit leads"
  on leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admin read leads" on leads;
create policy "admin read leads"
  on leads for select
  to authenticated
  using (true);

drop policy if exists "admin update leads" on leads;
create policy "admin update leads"
  on leads for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin delete leads" on leads;
create policy "admin delete leads"
  on leads for delete
  to authenticated
  using (true);

-- =====================================================================
-- STORAGE BUCKETS
-- Run this section too — it creates buckets for property media.
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('brochures', 'brochures', true)
on conflict (id) do nothing;

-- Public can read (needed so <Image> / download links work on the site).
drop policy if exists "public read property-images" on storage.objects;
create policy "public read property-images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-images');

drop policy if exists "public read brochures" on storage.objects;
create policy "public read brochures"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'brochures');

-- Only authenticated admins can upload/replace/delete.
drop policy if exists "admin write property-images" on storage.objects;
create policy "admin write property-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images');

drop policy if exists "admin update property-images" on storage.objects;
create policy "admin update property-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'property-images');

drop policy if exists "admin delete property-images" on storage.objects;
create policy "admin delete property-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images');

drop policy if exists "admin write brochures" on storage.objects;
create policy "admin write brochures"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'brochures');

drop policy if exists "admin update brochures" on storage.objects;
create policy "admin update brochures"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'brochures');

drop policy if exists "admin delete brochures" on storage.objects;
create policy "admin delete brochures"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'brochures');

-- =====================================================================
-- NOTES
-- =====================================================================
-- 1. "authenticated" here means ANY logged-in Supabase Auth user. For V1,
--    admin accounts are created manually in Supabase Dashboard > Authentication
--    (there is no public sign-up flow — see app/admin/login). If the team
--    grows, add a `profiles` table with a `role` column and tighten these
--    policies to `using (is_admin())` instead of `using (true)`.
-- 2. File size/type limits for uploads are enforced in the admin upload
--    code (lib/validations) and can additionally be capped per-bucket in
--    Supabase Dashboard > Storage > Bucket settings.
