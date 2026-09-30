# Security

## Secret handling
- Supabase URL + anon key: public-safe, exposed via `NEXT_PUBLIC_SUPABASE_URL`.
- Supabase service role key: server-only, never in frontend. Stored as Vercel env var.
- No secrets in client bundles. All mutations go through server actions or RLS-protected client calls.

## Permission model
**v1 (demo-first):** permissive RLS — all rows readable/writable without login. Seed data visible to anonymous visitors.
**Lock-down (later sprint):**
- Enable `auth.uid() = user_id` on all tables.
- Only the 4 finance team members have accounts (manually provisioned).
- All team members share the same team scope — any member can read/write any row (team-level access, not per-row owner-only).
- Service role key used only in server actions for audit logging.

## Approved-tools rule
No raw SQL execution from the client. All data access through `lib/data/` functions. Later agentic tools are named, scoped functions — never `run_any` or `send_any`.

## Audit principle
Every meaningful mutation (create/edit/delete payment, receipt, account) logs: who, what, when, before/after. In v1, rely on `created_at` timestamps. Later: dedicated `audit_logs` table with full event capture.

## Data integrity
- `amount` columns are `numeric(14,2)` — no float drift.
- `bank_account_id` foreign keys enforced.
- Available balance always server-derived — never stored, never client-calculated. Survives refresh, identical on every device.