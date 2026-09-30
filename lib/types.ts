export type BankAccount = {
  id: string;
  name: string;
  account_number: string;
  opening_balance: number;
  created_at: string;
};

export type Payment = {
  id: string;
  bank_account_id: string;
  payee: string;
  invoice_ref: string | null;
  amount: number;
  payment_date: string;
  cleared: boolean;
  cleared_date: string | null;
  created_at: string;
  bank_accounts?: Pick<BankAccount, "name"> | null;
};

export type Receipt = {
  id: string;
  bank_account_id: string;
  source: string;
  reference: string | null;
  amount: number;
  receipt_date: string;
  cleared: boolean;
  cleared_date: string | null;
  created_at: string;
  bank_accounts?: Pick<BankAccount, "name"> | null;
};

export type AccountBalance = BankAccount & {
  available_balance: number;
  total_payments: number;
  total_receipts: number;
};
