create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  status text not null default 'pending', -- pending | paid | cancelled
  locale text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address text not null,
  delivery_city text not null,
  delivery_postcode text not null,
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

-- Row Level Security: only the service role (server) may read/write orders.
-- No anon/public access — orders are never queried directly from the browser.
alter table orders enable row level security;
