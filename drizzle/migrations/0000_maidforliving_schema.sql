
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create policy "Users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- First account ever created becomes the admin
create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created_first_admin
  after insert on auth.users for each row execute function public.handle_first_admin();

-- updated_at helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

-- Services
create table public.services (
  slug text primary key,
  name text not null,
  short_description text not null default '',
  base_price numeric(10,2) not null default 0,
  is_active boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "Public read services" on public.services for select to anon, authenticated using (true);
create policy "Admins manage services" on public.services for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger services_touch before update on public.services for each row execute function public.touch_updated_at();

-- Pricing
create table public.pricing (
  key text primary key,
  label text not null,
  category text not null,
  amount numeric(10,2) not null default 0,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.pricing to anon, authenticated;
grant insert, update, delete on public.pricing to authenticated;
grant all on public.pricing to service_role;
alter table public.pricing enable row level security;
create policy "Public read pricing" on public.pricing for select to anon, authenticated using (true);
create policy "Admins manage pricing" on public.pricing for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger pricing_touch before update on public.pricing for each row execute function public.touch_updated_at();

-- Service areas
create table public.service_areas (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  state text not null default '',
  zip_codes text[] not null default '{}',
  description text not null default '',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.service_areas to anon, authenticated;
grant insert, update, delete on public.service_areas to authenticated;
grant all on public.service_areas to service_role;
alter table public.service_areas enable row level security;
create policy "Public read active areas" on public.service_areas for select to anon, authenticated
  using (is_active or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage areas" on public.service_areas for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Testimonials
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  location text not null default '',
  rating int not null default 5,
  review text not null,
  is_sample boolean not null default true,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "Public read published testimonials" on public.testimonials for select to anon, authenticated
  using (is_published or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage testimonials" on public.testimonials for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Site settings (contact info + content)
create table public.site_settings (
  key text primary key,
  label text not null,
  value text not null default '',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins manage settings" on public.site_settings for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();

-- Customers
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text not null default '',
  address text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.customers to authenticated;
grant all on public.customers to service_role;
alter table public.customers enable row level security;
create policy "Admins manage customers" on public.customers for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger customers_touch before update on public.customers for each row execute function public.touch_updated_at();

-- Bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  service_slug text not null,
  service_name text not null,
  bedrooms int not null default 1,
  bathrooms int not null default 1,
  zip_code text not null,
  home_size text not null,
  frequency text not null,
  addons text[] not null default '{}',
  preferred_date date not null,
  preferred_time text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  special_instructions text not null default '',
  estimated_price numeric(10,2) not null default 0,
  status text not null default 'pending',
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.bookings to authenticated;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
create policy "Admins manage bookings" on public.bookings for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger bookings_touch before update on public.bookings for each row execute function public.touch_updated_at();

-- Quote requests
create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  zip_code text not null,
  bedrooms int not null default 1,
  bathrooms int not null default 1,
  home_size text not null,
  cleaning_type text not null,
  estimated_price numeric(10,2) not null default 0,
  full_name text not null default '',
  email text not null default '',
  phone text not null default '',
  status text not null default 'new',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.quote_requests to authenticated;
grant all on public.quote_requests to service_role;
alter table public.quote_requests enable row level security;
create policy "Admins manage quotes" on public.quote_requests for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Contact messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null default '',
  service text not null default '',
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "Admins manage messages" on public.contact_messages for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Seed data
insert into public.services (slug, name, short_description, base_price, sort_order) values
('standard-house-cleaning','Standard House Cleaning','Dusting, vacuuming, mopping, kitchen and bathroom cleaning.',120,1),
('deep-cleaning','Deep Cleaning','Detailed cleaning of hard-to-reach areas, baseboards, kitchens, and bathrooms.',220,2),
('move-in-cleaning','Move-In Cleaning','Prepare your new home before moving in.',250,3),
('move-out-cleaning','Move-Out Cleaning','Detailed cleaning before leaving a property.',250,4),
('apartment-cleaning','Apartment Cleaning','Cleaning solutions designed for apartments and condos.',100,5),
('office-cleaning','Office Cleaning','Professional office and commercial cleaning.',150,6),
('green-cleaning','Green Cleaning','Eco-conscious cleaning options for your home.',135,7),
('after-event-cleaning','After Event Cleaning','Cleaning after parties and special events.',200,8),
('home-organization','Home Organization','Organizing bedrooms, closets, kitchens, and living spaces.',180,9);

insert into public.pricing (key, label, category, amount, sort_order) values
('per_extra_bedroom','Each bedroom after the first','rooms',20,1),
('per_extra_bathroom','Each bathroom after the first','rooms',25,2),
('size_under_1000','Under 1,000 sq ft','size',0,10),
('size_1000_1999','1,000 – 1,999 sq ft','size',30,11),
('size_2000_2999','2,000 – 2,999 sq ft','size',60,12),
('size_3000_plus','3,000+ sq ft','size',100,13),
('freq_one_time','One-Time (discount %)','frequency',0,20),
('freq_weekly','Weekly (discount %)','frequency',20,21),
('freq_biweekly','Biweekly (discount %)','frequency',15,22),
('freq_monthly','Monthly (discount %)','frequency',10,23),
('addon_fridge','Inside Fridge','addon',35,30),
('addon_oven','Inside Oven','addon',35,31),
('addon_windows','Interior Windows','addon',40,32),
('addon_cabinets','Inside Cabinets','addon',40,33),
('addon_laundry','Laundry & Folding','addon',25,34),
('addon_baseboards','Baseboard Detailing','addon',30,35);

insert into public.service_areas (city, state, zip_codes, description, sort_order) values
('Sample City A','ST','{"10001","10002","10003"}','Sample area — replace with your real service area from the admin dashboard.',1),
('Sample City B','ST','{"20001","20002"}','Sample area — replace with your real service area from the admin dashboard.',2),
('Sample City C','ST','{"30001","30002","30003"}','Sample area — replace with your real service area from the admin dashboard.',3);

insert into public.testimonials (customer_name, location, rating, review, is_sample) values
('Sample Customer','Sample City A',5,'Sample review: The team was on time, friendly and left our kitchen sparkling. Booking online took two minutes.',true),
('Sample Customer','Sample City B',5,'Sample review: We use the biweekly plan and the house always feels fresh. Great attention to detail.',true),
('Sample Customer','Sample City C',5,'Sample review: Our move-out cleaning was thorough and stress-free. Highly recommended.',true);

insert into public.site_settings (key, label, value, sort_order) values
('phone','Business phone','(555) 000-0000',1),
('email','Business email','hello@maidforliving.com',2),
('address','Business address','Your business address here',3),
('hours_weekdays','Hours (Mon–Fri)','8:00 AM – 6:00 PM',4),
('hours_saturday','Hours (Saturday)','9:00 AM – 4:00 PM',5),
('hours_sunday','Hours (Sunday)','Closed',6),
('facebook_url','Facebook URL','https://facebook.com',7),
('instagram_url','Instagram URL','https://instagram.com',8),
('twitter_url','X / Twitter URL','https://x.com',9),
('announcement','Top announcement bar','Now booking for this week — get your free quote in 60 seconds.',10);
