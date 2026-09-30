import { createClient } from "@/lib/supabase/server";
import type { Receipt } from "@/lib/types";
import { requireUserId, requireWorkspace } from "@/lib/data/workspace";

const receiptFields = "id,workspace_id,user_id,bank_account_id,source,reference,amount,receipt_date,cleared,cleared_date,created_at,bank_accounts(name)";

function normalize(row: Record<string, unknown>): Receipt {
  return { ...row, amount: Number(row.amount) } as Receipt;
}

export async function getReceipts(limit?: number): Promise<Receipt[]> {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  let query = supabase.from("receipts").select(receiptFields).eq("workspace_id", workspace.id).order("receipt_date", { ascending: false }).order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => normalize(row as unknown as Record<string, unknown>));
}

export async function getReceipt(id: string): Promise<Receipt | null> {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const { data, error } = await supabase.from("receipts").select(receiptFields).eq("id", id).eq("workspace_id", workspace.id).maybeSingle();
  if (error) throw error;
  return data ? normalize(data as unknown as Record<string, unknown>) : null;
}

export type ReceiptInput = Pick<Receipt, "bank_account_id" | "source" | "reference" | "amount" | "receipt_date" | "cleared" | "cleared_date">;

export async function insertReceipt(input: ReceiptInput) {
  const [workspace, userId] = await Promise.all([requireWorkspace(), requireUserId()]);
  const supabase = await createClient();
  const { data, error } = await supabase.from("receipts").insert({ ...input, workspace_id: workspace.id, user_id: userId }).select("id").single();
  if (error) throw error;
  return data;
}

export async function updateReceipt(id: string, input: ReceiptInput) {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const { error } = await supabase.from("receipts").update(input).eq("id", id).eq("workspace_id", workspace.id);
  if (error) throw error;
}

export async function setReceiptCleared(id: string, cleared: boolean) {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const { error } = await supabase.from("receipts").update({ cleared, cleared_date: cleared ? new Date().toISOString().slice(0, 10) : null }).eq("id", id).eq("workspace_id", workspace.id);
  if (error) throw error;
}

export async function removeReceipt(id: string) {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const { error } = await supabase.from("receipts").delete().eq("id", id).eq("workspace_id", workspace.id);
  if (error) throw error;
}
