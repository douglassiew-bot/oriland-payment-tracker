# Test Plan

## Authentication and authorization

1. Open `/` in a private browser session. Verify redirect to `/login?next=%2F`.
2. Verify the login page has email/password fields and no sign-up link or create-account control.
3. Enter invalid credentials. Verify the page shows a generic error without revealing whether the account exists.
4. Sign in with a manually provisioned member. Verify the workspace name and signed-in email appear in the header.
5. Sign out. Verify protected routes redirect back to `/login`.
6. Sign in with an Auth user that has no workspace membership. Verify redirect to `/no-access` with no ledger data displayed.

## Team isolation

7. Seed Owner A, Member A, and Owner B using `supabase/tests/0003_team_rls_isolation.sql` in a transaction.
8. Verify Owner A can read and mutate Workspace A rows.
9. Verify Member A can read Workspace A rows created by Owner A.
10. Verify Owner B cannot read or mutate Workspace A rows and cannot forge its `workspace_id` or `user_id`.
11. Verify anonymous requests return no workspace, account, payment, receipt, or audit-log rows.
12. Roll back the transaction and verify the test identities and workspaces leave no residue.

## Audit logging

13. Create, edit, and delete a bank account; verify one immutable audit row per operation with the correct actor and before/after values.
14. Repeat for a payment and a receipt.
15. Attempt to insert or modify `audit_logs` as an application user. Verify RLS rejects the request.

## Balance and mutation integrity

16. Create a payment within the available balance. Verify success and the exact derived balance.
17. Create a payment exceeding the balance. Verify the red insufficient-balance warning and exact shortfall.
18. Create a receipt. Verify the available balance increases by the exact amount.
19. Toggle a payment or receipt to cleared. Verify `cleared_date` is populated and the change is audited.
20. Delete the test records. Verify the derived balance returns to its prior value.
21. Attempt to submit a different `user_id` or workspace in a direct request. Verify database triggers preserve the authenticated creator and current workspace.

## Interface states

22. Verify empty account, payment, and receipt lists show their intended calls to action.
23. Disconnect the network and verify a recoverable error state.
24. Throttle the network and verify list loading skeletons.
25. At mobile width, verify the menu exposes every section and all forms remain usable.

## Automated checks

Run before deployment:

```bash
npx tsc --noEmit
npm run build
```

Run `supabase/tests/0003_team_rls_isolation.sql` against a non-production database, or inside its supplied transaction so all seeded test data is rolled back.
