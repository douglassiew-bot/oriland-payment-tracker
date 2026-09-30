# Security

## Secret handling

- The Supabase URL and anon key are public client configuration.
- The app does not use a service-role key for ordinary requests or audit logging.
- Authentication is handled with Supabase session cookies and refreshed in middleware.
- All mutations run through server actions and remain subject to row-level security (RLS).

## Authentication and provisioning

- Public sign-up is disabled. Accounts are created manually in Supabase Auth.
- The first authenticated user may claim the initial workspace as its owner.
- Additional users must be manually added to the workspace or match a pending workspace invitation.
- Unauthenticated requests are redirected to `/login`; an authenticated user without membership is redirected to `/no-access`.

## Team-scoped permission model

- `workspace_members` is the source of team membership and role information.
- Every account, payment, and receipt belongs to a `workspace_id`.
- Authenticated members may read and update rows in their workspace, regardless of which member created the row.
- Inserts must target the member's workspace and carry `user_id = auth.uid()`.
- Database triggers stamp and preserve creator and workspace identity so client input cannot impersonate another user or move a row between teams.
- Anonymous database access is denied.

## Audit logging

Database triggers append an immutable audit record for every insert, update, and delete on bank accounts, payments, and receipts. Each record captures the workspace, authenticated actor, operation, table and row identity, timestamp, and before/after JSON snapshots. Application users can read their workspace's audit history but cannot insert, update, or delete audit records directly.

## Approved-tools rule

No raw SQL is executed from the browser. Application data access goes through scoped functions in `lib/data/`; mutations go through server actions and database policies.

## Data integrity

- Monetary columns use `numeric(14,2)` to avoid floating-point drift.
- `bank_account_id` foreign keys are enforced.
- Available balance is derived on the server and filtered to the active workspace.
- The same RLS rules protect direct REST/database requests and application requests.
