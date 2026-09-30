# Tasks & Sprints

## Sprint 1 — Database + Core CRUD + Balance Engine (no login)
**Goal:** Working balance tracker with seeded data, viewable without login.
- [ ] Create Supabase migration (bank_accounts, payments, receipts + seed data).
- [ ] Build `lib/data/` layer: accounts.ts, payments.ts, receipts.ts (all CRUD functions).
- [ ] Build `lib/actions/balance.ts`: compute available balance per account.
- [ ] Bank accounts page: list accounts with available balance cards.
- [ ] Payments page: list, create, edit, delete payments with cleared toggle.
- [ ] Receipts page: list, create, edit, delete receipts with cleared toggle.
- [ ] Insufficient-balance alert: on payment create, if balance < 0 → red banner with exact shortfall + "Do NOT approve in Maybank2e."
- [ ] Responsive sidebar nav (desktop) / hamburger (mobile).

**Definition of Done:** An anonymous visitor opens the app, sees seeded bank accounts with correct available balances, creates a payment that exceeds balance, and sees the red insufficient-balance alert.

**← v1 functional milestone**

## Sprint 2 — Polish: Five States + Dashboard
**Goal:** Production-quality UX with all states handled.
- [ ] Loading skeletons for all list pages.
- [ ] Empty states with CTAs ("No payments yet — create one").
- [ ] Error states with retry (Supabase connection failure).
- [ ] Dashboard page: cross-account summary, total available balance, recent activity feed.
- [ ] Low-balance warning (yellow) when available < 10% of opening.
- [ ] Stale-uncleared reminder badge on payments > 3 days uncleared.
- [ ] Delete confirmation dialogs for all entities.
- [ ] Amount formatting (RM prefix, thousands separator).

**Definition of Done:** Every screen handles loading, empty, error, and ready states. Dashboard shows total available balance across all accounts.

## Sprint 3 — Lock Down: Auth + Per-User RLS
**Goal:** Secure app for real team use.
- [ ] Supabase Auth: login page, signup disabled (manual provisioning).
- [ ] Add `user_id` population on create (server actions).
- [ ] Replace v1 permissive RLS with team-scoped policies (`auth.uid() = user_id` OR shared team membership).
- [ ] Redirect unauthenticated users to /login.
- [ ] Audit log table + logging on all mutations.
- [ ] Test with 2+ seeded users to confirm isolation.

**Definition of Done:** Only logged-in team members can see/edit data. Anonymous access blocked. Mutations are audited.

## Sprint 4 — Intelligence (later)
- [ ] Auto-tag payment categories from payee name.
- [ ] Free-text payment entry with structured parsing (confidence + review_status).
- [ ] Weekly cash-flow summary report.
- [ ] Anomaly detection (unusual amount spike).

## Gantt
```
Sprint 1: DB + CRUD + balance engine + alert  ████████  (v1 functional)
Sprint 2: Five states + dashboard polish      ████████
Sprint 3: Auth + RLS lock-down                ████████
Sprint 4: Intelligence layer (later)          ░░░░░░░░
```