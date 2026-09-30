import { createClient } from "@/lib/supabase/server";
import type { Payment } from "@/lib/types";
import { requireUserId, requireWorkspace } from "@/lib/data/workspace";

const paymentFields = "id,workspace_id,user_id,bank_account_id,payee,invoice_ref,voucher_number,amount,payment_date,cleared,cleared_date,created_at,bank_accounts(name)";

function normalize(row: Record<string, unknown>): Payment {
  return { ...row, amount: Number(row.amount) } as Payment;
}

export async function getPayments(limit?: number): Promise<Payment[]> {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  let query = supabase.from("payments").select(paymentFields).eq("workspace_id", workspace.id).order("payment_date", { ascending: false }).order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => normalize(row as unknown as Record<string, unknown>));
}

export async function getPayment(id: string): Promise<Payment | null> {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const { data, error } = await supabase.from("payments").select(paymentFields).eq("id", id).eq("workspace_id", workspace.id).maybeSingle();
  if (error) throw error;
  return data ? normalize(data as unknown as Record<string, unknown>) : null;
}

export type PaymentInput = Pick<Payment, "bank_account_id" | "payee" | "invoice_ref" | "voucher_number" | "amount" | "payment_date" | "cleared" | "cleared_date">;

export async function insertPayment(input: PaymentInput) {
  const [workspace, userId] = await Promise.all([requireWorkspace(), requireUserId()]);
  const supabase = await createClient();
  const { data, error } = await supabase.from("payments").insert({ ...input, workspace_id: workspace.id, user_id: userId }).select("id").single();
  if (error) throw error;
  return data;
}

export async function updatePayment(id: string, input: PaymentInput) {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const { error } = await supabase.from("payments").update(input).eq("id", id).eq("workspace_id", workspace.id);
  if (error) throw error;
}

export async function setPaymentCleared(id: string, cleared: boolean) {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const { error } = await supabase.from("payments").update({ cleared, cleared_date: cleared ? new Date().toISOString().slice(0, 10) : null }).eq("id", id).eq("workspace_id", workspace.id);
  if (error) throw error;
}

export async function removePayment(id: string) {
  const workspace = await requireWorkspace();
  const supabase = await createClient();
  const { error } = await supabase.from("payments").delete().eq("id", id).eq("workspace_id", workspace.id);
  if (error) throw error;
}
