# Data Model

## bank_accounts
| Field | Type | Notes |
|------|------|-------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | nullable (owner-scoping at lock-down) |
| name | text | e.g. "Maybank Operating Account" |
| account_number | text | masked display, e.g. "••••1234" |
| opening_balance | numeric(14,2) | starting balance for the tracking period |
| created_at | timestamptz | default now() |

**RLS:** v1 permissive read/write (demo-first). Lock-down: `auth.uid() = user_id`.

## payments
| Field | Type | Notes |
|------|------|-------|
| id | uuid | PK |
| user_id | uuid | nullable |
| bank_account_id | uuid | FK → bank_accounts.id |
| payee | text | recipient name |
| invoice_ref | text | invoice/reference number |
| amount | numeric(14,2) | positive, outflow |
| payment_date | date | scheduled or actual |
| cleared | boolean | default false — settled in Maybank2e |
| cleared_date | date | nullable, set when cleared = true |
| created_at | timestamptz | default now() |

**RLS:** v1 permissive. Lock-down: `auth.uid() = user_id`.

## receipts
| Field | Type | Notes |
|------|------|-------|
| id | uuid | PK |
| user_id | uuid | nullable |
| bank_account_id | uuid | FK → bank_accounts.id |
| source | text | who sent the funds |
| reference | text | remittance/reference number |
| amount | numeric(14,2) | positive, inflow |
| receipt_date | date | date credited |
| cleared | boolean | default false — visible in bank statement |
| cleared_date | date | nullable |
| created_at | timestamptz | default now() |

**RLS:** v1 permissive. Lock-down: `auth.uid() = user_id`.

## Derived: available balance
`available_balance = opening_balance + SUM(receipts.amount) − SUM(payments.amount)`
Calculated server-side per bank account on every read. Not stored — always derived from live data.

## AI fields
No AI-generated fields in v1. Later intelligence (anomaly detection) will add `source text`, `confidence numeric`, `review_status text default 'unreviewed'` to a separate `balance_alerts` table.