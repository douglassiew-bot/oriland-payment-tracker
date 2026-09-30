"use server";

import { revalidatePath } from "next/cache";
import { computeAvailableBalance } from "@/lib/actions/balance";
import { actionError, goWithMessage, readAmount, readRequired } from "@/lib/actions/helpers";
import { insertPayment, removePayment, setPaymentCleared, updatePayment, type PaymentInput } from "@/lib/data/payments";

function readPayment(formData: FormData) {
  const cleared = formData.get("cleared") === "on";
  return {
    bank_account_id: readRequired(formData, "bank_account_id"),
    payee: readRequired(formData, "payee"),
    invoice_ref: String(formData.get("invoice_ref") ?? "").trim() || null,
    voucher_number: String(formData.get("voucher_number") ?? "").trim() || null,
    amount: readAmount(formData, "amount"),
    payment_date: readRequired(formData, "payment_date"),
    cleared,
    cleared_date: cleared ? new Date().toISOString().slice(0, 10) : null,
  };
}

export async function createPaymentAction(formData: FormData) {
  let input: PaymentInput;
  try {
    input = readPayment(formData);
    await insertPayment(input);
  } catch (error) {
    goWithMessage("/payments/new", actionError(error, "The payment could not be saved. Check the connection and try again."), "error");
  }
  const balance = await computeAvailableBalance(input.bank_account_id);
  revalidatePath("/", "layout");
  if (balance < 0) {
    goWithMessage("/payments", `Insufficient balance. Do NOT approve this payment in Maybank2e. Shortfall: RM ${Math.abs(balance).toLocaleString("en-MY", { minimumFractionDigits: 2 })}.`, "error");
  }
  goWithMessage("/payments", "Payment created and available balance recalculated.");
}

export async function updatePaymentAction(id: string, formData: FormData) {
  try {
    await updatePayment(id, readPayment(formData));
  } catch (error) {
    goWithMessage(`/payments/${id}/edit`, actionError(error, "The payment could not be updated. Check the connection and try again."), "error");
  }
  revalidatePath("/", "layout");
  goWithMessage("/payments", "Payment updated.");
}

export async function deletePaymentAction(id: string) {
  await removePayment(id);
  revalidatePath("/", "layout");
  goWithMessage("/payments", "Payment deleted. Available balance restored.");
}

export async function togglePaymentAction(id: string, formData: FormData) {
  await setPaymentCleared(id, formData.get("cleared") === "true");
  revalidatePath("/", "layout");
}
