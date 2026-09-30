import { createClient } from "@/lib/supabase/server";
import type { BankAccount } from "@/lib/types";
import { requireUserId, requireWorkspace } from "@/lib/data/workspace";

export async function getAccounts(): Promise<BankAccount[]> {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("id,workspace_id,user_id,name,account_number,opening_balance,created_at")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({ ...row, opening_balance: Number(row.opening_balance) }));
}

export async function getAccount(id: string): Promise<BankAccount | null> {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("id,workspace_id,user_id,name,account_number,opening_balance,created_at")
    .eq("id", id)
    .eq("workspace_id", workspace.id)
    .maybeSingle();
  if (error) throw error;
  return data ? { ...data, opening_balance: Number(data.opening_balance) } : null;
}

export async function insertAccount(input: Pick<BankAccount, "name" | "account_number" | "opening_balance">) {
  const [workspace, userId] = await Promise.all([requireWorkspace(), requireUserId()]);
  const supabase = await createClient();
  const { data, error } = await supabase.from("bank_accounts").insert({ ...input, workspace_id: workspace.id, user_id: userId }).select("id").single();
  if (error) throw error;
  return data;
}

export async function updateAccount(id: string, input: Pick<BankAccount, "name" | "account_number" | "opening_balance">) {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const { error } = await supabase.from("bank_accounts").update(input).eq("id", id).eq("workspace_id", workspace.id);
  if (error) throw error;
}

export async function removeAccount(id: string) {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const { error } = await supabase.from("bank_accounts").delete().eq("id", id).eq("workspace_id", workspace.id);
  if (error) throw error;
}
