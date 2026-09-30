# Architecture

## Stack
Next.js 15 (App Router) + Supabase (Postgres) + Vercel. TypeScript. Tailwind CSS.

## Build now vs later
**Now (v1):** bank account list with live balance, payment CRUD, receipt CRUD, insufficient-balance alert engine, responsive sidebar shell.
**Later:** user auth + per-user RLS, audit logging, anomaly detection, multi-account forecasting.

## Key user action flow (create payment)
1. User opens /payments, clicks "New Payment."
2. Form collects: bank account, payee, invoice ref, amount, date.
3. On submit, server action writes payment row to DB.
4. Balance engine recalculates available balance for that account.
5. If available balance < 0 → return alert flag + warning copy.
6. UI shows green success or red alert banner with exact shortfall amount.

## Responsive nav shell
Persistent left sidebar (desktop) with sections: Dashboard, Bank Accounts, Payments, Receipts. Collapses to hamburger menu (mobile). Current section highlighted. Keyboard-accessible.

## Layer plan
1. **Data layer** (`lib/data/`) — all DB reads/writes via Supabase client; no inline SQL in UI.
2. **Server logic** (`lib/actions/`) — balance calculation, payment/receipt mutations, alert logic.
3. **UI** (`app/`, `components/`) — pages and shared components; call data layer, never touch DB directly.
4. **Intelligence** (`lib/ai/`) — later: anomaly detection, spend pattern scoring.

## Why core runs without AI
Balance calc is pure arithmetic on DB rows. The alert is a simple `available < 0` check. No AI needed for the core engine — it works with AI switched off.

## Repo structure
```
lib/data/          # data-access layer (accounts.ts, payments.ts, receipts.ts)
lib/actions/       # server logic (balance.ts, payment-actions.ts, receipt-actions.ts)
lib/ai/            # later: anomaly detection
app/               # Next.js pages (dashboard, accounts, payments, receipts)
components/        # shared UI (Sidebar, AlertBanner, BalanceCard, forms)
__tests__/         # tests beside the code they test
```

## Module map
| Module | Responsibility | Owns | Build order |
|--------|---------------|------|-------------|
| accounts | Bank account CRUD + opening balance | bank_accounts | 1st |
| payments | Payment outflow CRUD | payments | 2nd |
| receipts | Receipt inflow CRUD | receipts | 3rd |
| balance-engine | Calculate available balance + trigger alert | derived (all three tables) | 4th |
| dashboard | Cross-account summary view | reads all tables | 5th |
| auth | Login + per-user RLS (lock-down) | users, RLS policies | 6th (later) |