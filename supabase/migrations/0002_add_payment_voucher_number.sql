alter table payments
  add column if not exists voucher_number text;

comment on column payments.voucher_number is
  'Internal payment voucher number used by the finance team.';
