# Oriland Payment Tracker

A team-scoped payment and available-balance ledger built with Next.js and Supabase.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19, Server Actions) |
| Language | TypeScript strict |
| Styles | Tailwind CSS v4 (CSS-first, no config file) |
| Auth + DB | Supabase (`@supabase/ssr`) |
| Package manager | Bun |
| Deploy | Vercel |

## Quick start

```bash
bun install
cp .env.example .env.local   # fill in your Supabase keys
bun dev
```

Open http://localhost:3000.

## Access provisioning

Public sign-up is disabled. Create users manually in Supabase Auth. The first authenticated user claims the initial workspace as owner; later users need a matching workspace invitation or a manually created `workspace_members` row. See `docs/SECURITY.md` for the authorization model and `docs/TEST_PLAN.md` for isolation checks.

## Security migrations

Apply migrations in `supabase/migrations/` in order. Sprint 3 authorization is defined by `0003_team_workspaces.sql`; its transactional isolation test is in `supabase/tests/0003_team_rls_isolation.sql`.
