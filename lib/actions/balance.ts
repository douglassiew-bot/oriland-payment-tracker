import { createClient } from "@/lib/supabase/server";
import { getAccounts } from "@/lib/data/accounts";
import type { AccountBalance } from "@/lib/types";

export async function computeAvailableBalance(accountId: string): Promise<number> {
  const supabase = await createClient();
  const [{ data: account, error: accountError }, { data: payments, error: paymentError }, { data: receipts, error: receiptError }] = await Promise.all([
    supabase.from("bank_accounts").select("opening_balance").eq("id", accountId).single(),
    supabase.from("payments").select("amount").eq("bank_account_id", accountId),
    supabase.from("receipts").select("amount").eq("bank_account_id", accountId).eq("cleared", true),
  ]);
  if (accountError) throw accountError;
  if (paymentError) throw paymentError;
  if (receiptError) throw receiptError;
  const outflow = (payments ?? []).reduce((sum, item) => sum + Number(item.amount), 0);
  const inflow = (receipts ?? []).reduce((sum, item) => sum + Number(item.amount), 0);
  return Number(account.opening_balance) + inflow - outflow;
}

export async function getAccountsWithBalances(): Promise<AccountBalance[]> {
  const accounts = await getAccounts();
  const supabase = await createClient();
  const [{ data: payments, error: paymentError }, { data: receipts, error: receiptError }] = await Promise.all([
    supabase.from("payments").select("bank_account_id,amount"),
    supabase.from("receipts").select("bank_account_id,amount").eq("cleared", true),
  ]);
  if (paymentError) throw paymentError;
  if (receiptError) throw receiptError;
  return accounts.map((account) => {
    const totalPayments = (payments ?? []).filter((item) => item.bank_account_id === account.id).reduce((sum, item) => sum + Number(item.amount), 0);
    const totalReceipts = (receipts ?? []).filter((item) => item.bank_account_id === account.id).reduce((sum, item) => sum + Number(item.amount), 0);
    return { ...account, total_payments: totalPayments, total_receipts: totalReceipts, available_balance: account.opening_balance + totalReceipts - totalPayments };
  });
}
