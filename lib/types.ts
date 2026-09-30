export type BankAccount = {
  id: string;
  workspace_id: string;
  user_id: string | null;
  name: string;
  account_number: string;
  opening_balance: number;
  created_at: string;
};

export type Payment = {
  id: string;
  workspace_id: string;
  user_id: string | null;
  bank_account_id: string;
  payee: string;
  invoice_ref: string | null;
  voucher_number: string | null;
  amount: number;
  payment_date: string;
  cleared: boolean;
  cleared_date: string | null;
  created_at: string;
  bank_accounts?: Pick<BankAccount, "name"> | null;
};

export type Receipt = {
  id: string;
  workspace_id: string;
  user_id: string | null;
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

export type WorkspaceRole = "owner" | "member";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  role: WorkspaceRole;
};

export type WorkspaceMember = {
  user_id: string;
  email: string;
  role: WorkspaceRole;
  created_at: string;
};

export type WorkspaceInvitation = {
  id: string;
  email: string;
  role: WorkspaceRole;
  status: "pending" | "accepted" | "revoked";
  created_at: string;
};
