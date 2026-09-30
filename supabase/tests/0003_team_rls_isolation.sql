begin;

-- Disposable users and workspaces. The transaction is rolled back so this test
-- never leaves auth accounts or finance data behind.
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alpha.owner@example.test', '', now(), '{}', '{}', now(), now()),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'beta.owner@example.test', '', now(), '{}', '{}', now(), now()),
  ('10000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alpha.member@example.test', '', now(), '{}', '{}', now(), now())
on conflict (id) do nothing;

insert into workspaces (id, name, slug) values
  ('20000000-0000-4000-8000-000000000001', 'Alpha Test Team', 'alpha-test-team'),
  ('20000000-0000-4000-8000-000000000002', 'Beta Test Team', 'beta-test-team');

insert into workspace_members (workspace_id, user_id, email, role) values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'alpha.owner@example.test', 'owner'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', 'alpha.member@example.test', 'member'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'beta.owner@example.test', 'owner');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","email":"alpha.owner@example.test","role":"authenticated"}', true);

insert into bank_accounts (id, workspace_id, user_id, name, account_number, opening_balance)
values ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Alpha Account', 'ALPHA-1', 1000);

do $$
begin
  if (select count(*) from bank_accounts where id = '30000000-0000-4000-8000-000000000001') <> 1 then
    raise exception 'Alpha owner cannot read its own workspace row';
  end if;
end $$;

select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000002","email":"beta.owner@example.test","role":"authenticated"}', true);

do $$
begin
  if (select count(*) from bank_accounts where id = '30000000-0000-4000-8000-000000000001') <> 0 then
    raise exception 'Cross-workspace isolation failed: Beta can read Alpha data';
  end if;

  begin
    insert into bank_accounts (workspace_id, user_id, name, account_number, opening_balance)
    values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', 'Forbidden', 'NOPE', 1);
    raise exception 'Cross-workspace isolation failed: Beta inserted into Alpha';
  exception when insufficient_privilege then
    null;
  end;
end $$;

select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000003","email":"alpha.member@example.test","role":"authenticated"}', true);

do $$
begin
  if (select count(*) from bank_accounts where id = '30000000-0000-4000-8000-000000000001') <> 1 then
    raise exception 'Same-team sharing failed: Alpha member cannot read Alpha data';
  end if;
  if (select count(*) from audit_logs where entity_id = '30000000-0000-4000-8000-000000000001' and action = 'insert') <> 1 then
    raise exception 'Audit logging failed for the finance insert';
  end if;
end $$;

reset role;
rollback;
