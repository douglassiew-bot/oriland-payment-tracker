create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists workspace_members (
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create unique index if not exists workspace_members_email_key
  on workspace_members (workspace_id, lower(email));

create table if not exists workspace_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('owner', 'member')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create unique index if not exists workspace_pending_invitation_key
  on workspace_invitations (workspace_id, lower(email)) where status = 'pending';

insert into workspaces (id, name, slug)
values ('f1000000-0000-4000-8000-000000000001', 'Oriland Finance', 'oriland-finance')
on conflict (id) do nothing;

alter table bank_accounts add column if not exists workspace_id uuid references workspaces(id) on delete cascade;
alter table payments add column if not exists workspace_id uuid references workspaces(id) on delete cascade;
alter table receipts add column if not exists workspace_id uuid references workspaces(id) on delete cascade;

update bank_accounts set workspace_id = 'f1000000-0000-4000-8000-000000000001' where workspace_id is null;
update payments set workspace_id = 'f1000000-0000-4000-8000-000000000001' where workspace_id is null;
update receipts set workspace_id = 'f1000000-0000-4000-8000-000000000001' where workspace_id is null;

alter table bank_accounts alter column workspace_id set not null;
alter table payments alter column workspace_id set not null;
alter table receipts alter column workspace_id set not null;

create index if not exists bank_accounts_workspace_id_idx on bank_accounts(workspace_id);
create index if not exists payments_workspace_id_idx on payments(workspace_id);
create index if not exists receipts_workspace_id_idx on receipts(workspace_id);

-- Finance rows retain the authenticated creator. Historical demo rows remain
-- nullable because they predate authentication; every new row is attributed.
create or replace function stamp_finance_creator()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.user_id := auth.uid();
  else
    new.user_id := old.user_id;
    new.workspace_id := old.workspace_id;
  end if;
  return new;
end;
$$;

drop trigger if exists bank_accounts_creator on bank_accounts;
create trigger bank_accounts_creator before insert or update on bank_accounts for each row execute function stamp_finance_creator();
drop trigger if exists payments_creator on payments;
create trigger payments_creator before insert or update on payments for each row execute function stamp_finance_creator();
drop trigger if exists receipts_creator on receipts;
create trigger receipts_creator before insert or update on receipts for each row execute function stamp_finance_creator();

create or replace function is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from workspace_members
    where workspace_id = target_workspace_id and user_id = auth.uid()
  );
$$;

create or replace function is_workspace_owner(target_workspace_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from workspace_members
    where workspace_id = target_workspace_id and user_id = auth.uid() and role = 'owner'
  );
$$;

create or replace function claim_workspace_access()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  viewer_id uuid := auth.uid();
  viewer_email text := lower(auth.jwt() ->> 'email');
  claimed_workspace_id uuid;
  invitation_role text;
begin
  if viewer_id is null or viewer_email is null then
    return null;
  end if;

  perform pg_advisory_xact_lock(hashtext('oriland-workspace-bootstrap'));

  select workspace_id into claimed_workspace_id
  from workspace_members
  where user_id = viewer_id
  order by created_at
  limit 1;

  if claimed_workspace_id is null then
    select workspace_id, role into claimed_workspace_id, invitation_role
    from workspace_invitations
    where lower(email) = viewer_email and status = 'pending'
    order by created_at
    limit 1;

    if claimed_workspace_id is not null then
      insert into workspace_members (workspace_id, user_id, email, role)
      values (claimed_workspace_id, viewer_id, viewer_email, invitation_role)
      on conflict (workspace_id, user_id) do nothing;

      update workspace_invitations
      set status = 'accepted', accepted_at = now()
      where workspace_id = claimed_workspace_id and lower(email) = viewer_email and status = 'pending';
    end if;
  end if;

  -- Safe one-time bootstrap for the initial deployment. After the first owner
  -- claims the legacy workspace, every additional user must be invited.
  if claimed_workspace_id is null and not exists (select 1 from workspace_members) then
    claimed_workspace_id := 'f1000000-0000-4000-8000-000000000001';
    insert into workspace_members (workspace_id, user_id, email, role)
    values (claimed_workspace_id, viewer_id, viewer_email, 'owner');
    update workspaces set created_by = viewer_id where id = claimed_workspace_id;
  end if;

  return claimed_workspace_id;
end;
$$;

revoke all on function is_workspace_member(uuid) from public;
revoke all on function is_workspace_owner(uuid) from public;
revoke all on function claim_workspace_access() from public;
grant execute on function is_workspace_member(uuid) to authenticated;
grant execute on function is_workspace_owner(uuid) to authenticated;
grant execute on function claim_workspace_access() to authenticated;

alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table workspace_invitations enable row level security;

create policy "workspaces_member_read" on workspaces for select to authenticated using (is_workspace_member(id));
create policy "workspaces_owner_update" on workspaces for update to authenticated using (is_workspace_owner(id)) with check (is_workspace_owner(id));
create policy "members_team_read" on workspace_members for select to authenticated using (is_workspace_member(workspace_id));
create policy "members_owner_write" on workspace_members for all to authenticated using (is_workspace_owner(workspace_id)) with check (is_workspace_owner(workspace_id));
create policy "invitations_owner_read" on workspace_invitations for select to authenticated using (is_workspace_owner(workspace_id));
create policy "invitations_owner_insert" on workspace_invitations for insert to authenticated with check (is_workspace_owner(workspace_id) and invited_by = auth.uid());
create policy "invitations_owner_update" on workspace_invitations for update to authenticated using (is_workspace_owner(workspace_id)) with check (is_workspace_owner(workspace_id));
create policy "invitations_owner_delete" on workspace_invitations for delete to authenticated using (is_workspace_owner(workspace_id));

drop policy if exists "bank_accounts_v1_read" on bank_accounts;
drop policy if exists "bank_accounts_v1_write" on bank_accounts;
drop policy if exists "payments_v1_read" on payments;
drop policy if exists "payments_v1_write" on payments;
drop policy if exists "receipts_v1_read" on receipts;
drop policy if exists "receipts_v1_write" on receipts;

create policy "bank_accounts_workspace_read" on bank_accounts for select to authenticated using (is_workspace_member(workspace_id));
create policy "bank_accounts_workspace_insert" on bank_accounts for insert to authenticated with check (is_workspace_member(workspace_id) and user_id = auth.uid());
create policy "bank_accounts_workspace_update" on bank_accounts for update to authenticated using (is_workspace_member(workspace_id)) with check (is_workspace_member(workspace_id));
create policy "bank_accounts_workspace_delete" on bank_accounts for delete to authenticated using (is_workspace_member(workspace_id));
create policy "payments_workspace_read" on payments for select to authenticated using (is_workspace_member(workspace_id));
create policy "payments_workspace_insert" on payments for insert to authenticated with check (is_workspace_member(workspace_id) and user_id = auth.uid());
create policy "payments_workspace_update" on payments for update to authenticated using (is_workspace_member(workspace_id)) with check (is_workspace_member(workspace_id));
create policy "payments_workspace_delete" on payments for delete to authenticated using (is_workspace_member(workspace_id));
create policy "receipts_workspace_read" on receipts for select to authenticated using (is_workspace_member(workspace_id));
create policy "receipts_workspace_insert" on receipts for insert to authenticated with check (is_workspace_member(workspace_id) and user_id = auth.uid());
create policy "receipts_workspace_update" on receipts for update to authenticated using (is_workspace_member(workspace_id)) with check (is_workspace_member(workspace_id));
create policy "receipts_workspace_delete" on receipts for delete to authenticated using (is_workspace_member(workspace_id));

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_workspace_id_idx on audit_logs(workspace_id, created_at desc);
alter table audit_logs enable row level security;
create policy "audit_logs_workspace_read" on audit_logs for select to authenticated using (is_workspace_member(workspace_id));

create or replace function log_finance_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  row_before jsonb;
  row_after jsonb;
  target_workspace_id uuid;
  target_id uuid;
begin
  row_before := case when tg_op = 'INSERT' then null else to_jsonb(old) end;
  row_after := case when tg_op = 'DELETE' then null else to_jsonb(new) end;
  target_workspace_id := coalesce(new.workspace_id, old.workspace_id);
  target_id := coalesce(new.id, old.id);

  insert into audit_logs (workspace_id, user_id, action, entity_type, entity_id, before_data, after_data)
  values (target_workspace_id, auth.uid(), lower(tg_op), tg_table_name, target_id, row_before, row_after);
  return coalesce(new, old);
end;
$$;

drop trigger if exists bank_accounts_audit on bank_accounts;
create trigger bank_accounts_audit after insert or update or delete on bank_accounts for each row execute function log_finance_mutation();
drop trigger if exists payments_audit on payments;
create trigger payments_audit after insert or update or delete on payments for each row execute function log_finance_mutation();
drop trigger if exists receipts_audit on receipts;
create trigger receipts_audit after insert or update or delete on receipts for each row execute function log_finance_mutation();
