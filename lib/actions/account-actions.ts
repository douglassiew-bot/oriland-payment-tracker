"use server";

import { revalidatePath } from "next/cache";
import { actionError, goWithMessage, readRequired } from "@/lib/actions/helpers";
import { insertAccount, removeAccount, updateAccount } from "@/lib/data/accounts";

function readAccount(formData: FormData) {
  const openingBalance = Number(formData.get("opening_balance"));
  if (!Number.isFinite(openingBalance) || openingBalance < 0) throw new Error("Opening balance must be zero or greater.");
  return { name: readRequired(formData, "name"), account_number: readRequired(formData, "account_number"), opening_balance: Math.round(openingBalance * 100) / 100 };
}

export async function createAccountAction(formData: FormData) {
  try {
    await insertAccount(readAccount(formData));
  } catch (error) {
    goWithMessage("/accounts/new", actionError(error, "The bank account could not be saved. Check the connection and try again."), "error");
  }
  revalidatePath("/", "layout");
  goWithMessage("/accounts", "Bank account created.");
}

export async function updateAccountAction(id: string, formData: FormData) {
  try {
    await updateAccount(id, readAccount(formData));
  } catch (error) {
    goWithMessage(`/accounts/${id}/edit`, actionError(error, "The bank account could not be updated. Check the connection and try again."), "error");
  }
  revalidatePath("/", "layout");
  goWithMessage("/accounts", "Bank account updated.");
}

export async function deleteAccountAction(id: string) {
  await removeAccount(id);
  revalidatePath("/", "layout");
  goWithMessage("/accounts", "Bank account and its transactions deleted.");
}
