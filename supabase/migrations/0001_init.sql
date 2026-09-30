create table if not exists bank_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  account_number text not null,
  opening_balance numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

alter table bank_accounts enable row level security;
drop policy if exists "bank_accounts_v1_read" on bank_accounts;
create policy "bank_accounts_v1_read" on bank_accounts for select using (true);
drop policy if exists "bank_accounts_v1_write" on bank_accounts;
create policy "bank_accounts_v1_write" on bank_accounts for all using (true) with check (true);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  bank_account_id uuid not null references bank_accounts(id) on delete cascade,
  payee text not null,
  invoice_ref text,
  amount numeric(14,2) not null,
  payment_date date not null,
  cleared boolean not null default false,
  cleared_date date,
  created_at timestamptz not null default now()
);

alter table payments enable row level security;
drop policy if exists "payments_v1_read" on payments;
create policy "payments_v1_read" on payments for select using (true);
drop policy if exists "payments_v1_write" on payments;
create policy "payments_v1_write" on payments for all using (true) with check (true);

create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  bank_account_id uuid not null references bank_accounts(id) on delete cascade,
  source text not null,
  reference text,
  amount numeric(14,2) not null,
  receipt_date date not null,
  cleared boolean not null default false,
  cleared_date date,
  created_at timestamptz not null default now()
);

alter table receipts enable row level security;
drop policy if exists "receipts_v1_read" on receipts;
create policy "receipts_v1_read" on receipts for select using (true);
drop policy if exists "receipts_v1_write" on receipts;
create policy "receipts_v1_write" on receipts for all using (true) with check (true);

insert into bank_accounts (id, name, account_number, opening_balance) values
  ('a1000000-0000-4000-8000-000000000001', 'Maybank Operating Account', '5621 8890 3341', 45000.00),
  ('a1000000-0000-4000-8000-000000000002', 'Maybank Payroll Account', '5621 8890 7782', 28000.00),
  ('a1000000-0000-4000-8000-000000000003', 'CIMB Reserve Account', '8010 5523 9981', 60000.00)
on conflict (id) do nothing;

insert into payments (bank_account_id, payee, invoice_ref, amount, payment_date, cleared, cleared_date) values
  ('a1000000-0000-4000-8000-000000000001', 'Synergy Solutions Sdn Bhd', 'SYN-2025-0312', 8500.00, '2025-01-15', true, '2025-01-16'),
  ('a1000000-0000-4000-8000-000000000001', 'Nusantara Logistics Sdn Bhd', 'NUS-2025-0089', 12300.00, '2025-01-18', false, null),
  ('a1000000-0000-4000-8000-000000000001', 'Global IT Services Sdn Bhd', 'GIS-2025-0144', 6700.00, '2025-01-20', false, null),
  ('a1000000-0000-4000-8000-000000000002', 'Payroll Batch January 2025', 'PAY-2025-01', 22000.00, '2025-01-25', true, '2025-01-25'),
  ('a1000000-0000-4000-8000-000000000003', 'Office Rental Sdn Bhd', 'RENT-2025-01', 8000.00, '2025-01-05', true, '2025-01-06')
on conflict (id) do nothing;

insert into receipts (bank_account_id, source, reference, amount, receipt_date, cleared, cleared_date) values
  ('a1000000-0000-4000-8000-000000000001', 'Megah Holdings Sdn Bhd', 'INV-MH-5567', 30000.00, '2025-01-12', true, '2025-01-13'),
  ('a1000000-0000-4000-8000-000000000001', 'Pacific Trade Sdn Bhd', 'INV-PT-2201', 15000.00, '2025-01-17', false, null),
  ('a1000000-0000-4000-8000-000000000002', 'Inter-account transfer', 'TRF-2025-0101', 5000.00, '2025-01-22', true, '2025-01-22'),
  ('a1000000-0000-4000-8000-000000000003', 'Setia Properties Sdn Bhd', 'INV-SP-9920', 12000.00, '2025-01-10', true, '2025-01-11'),
  ('a1000000-0000-4000-8000-000000000003', 'Diamond Ventures Sdn Bhd', 'INV-DV-3345', 8500.00, '2025-01-19', false, null)
on conflict (id) do nothing;