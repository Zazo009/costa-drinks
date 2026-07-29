create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  stripe_session_id text unique,
  payment_method text not null default 'online', -- online | cod
  status text not null default 'pending', -- pending | paid | cancelled
  locale text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address text not null,
  delivery_city text not null,
  delivery_postcode text not null,
  delivery_zone_id text,
  delivery_distance_km numeric,
  delivery_fee_cents integer not null default 0,
  delivery_slot_id text not null,
  delivery_slot_label text not null,
  age_confirmed boolean not null default false,
  id_verified_at_delivery boolean not null default false,
  items jsonb not null,
  amount_total_cents integer not null,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_status_idx on orders (status);
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_user_id_idx on orders (user_id);

-- Row Level Security: the service role (server) can always read/write.
-- Signed-in users may only read their own orders — never write directly.
alter table orders enable row level security;

drop policy if exists "Users can read own orders" on orders;
create policy "Users can read own orders"
  on orders for select
  using (auth.uid() = user_id);

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table favorites enable row level security;

drop policy if exists "Users manage own favorites" on favorites;
create policy "Users manage own favorites"
  on favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  address text not null,
  city text not null,
  postcode text not null,
  zone_id text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on addresses (user_id);

alter table addresses enable row level security;

drop policy if exists "Users manage own addresses" on addresses;
create policy "Users manage own addresses"
  on addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
