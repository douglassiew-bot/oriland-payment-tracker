"use server";

import { revalidatePath } from "next/cache";
import { goWithMessage, readAmount, readRequired } from "@/lib/actions/helpers";
import { insertReceipt, removeReceipt, setReceiptCleared, updateReceipt } from "@/lib/data/receipts";

function readReceipt(formData: FormData) {
  const cleared = formData.get("cleared") === "on";
  return {
    bank_account_id: readRequired(formData, "bank_account_id"),
    source: readRequired(formData, "source"),
    reference: String(formData.get("reference") ?? "").trim() || null,
    amount: readAmount(formData, "amount"),
    receipt_date: readRequired(formData, "receipt_date"),
    cleared,
    cleared_date: cleared ? new Date().toISOString().slice(0, 10) : null,
  };
}

export async function createReceiptAction(formData: FormData) {
  await insertReceipt(readReceipt(formData));
  revalidatePath("/", "layout");
  goWithMessage("/receipts", "Receipt created and available balance recalculated.");
}

export async function updateReceiptAction(id: string, formData: FormData) {
  await updateReceipt(id, readReceipt(formData));
  revalidatePath("/", "layout");
  goWithMessage("/receipts", "Receipt updated.");
}

export async function deleteReceiptAction(id: string) {
  await removeReceipt(id);
  revalidatePath("/", "layout");
  goWithMessage("/receipts", "Receipt deleted. Available balance recalculated.");
}

export async function toggleReceiptAction(id: string, formData: FormData) {
  await setReceiptCleared(id, formData.get("cleared") === "true");
  revalidatePath("/", "layout");
}
