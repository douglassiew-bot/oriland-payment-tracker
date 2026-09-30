"use server";

import { revalidatePath } from "next/cache";
import { goWithMessage, readRequired } from "@/lib/actions/helpers";
import { insertAccount, removeAccount, updateAccount } from "@/lib/data/accounts";

function readAccount(formData: FormData) {
  const openingBalance = Number(formData.get("opening_balance"));
  if (!Number.isFinite(openingBalance) || openingBalance < 0) throw new Error("Opening balance must be zero or greater.");
  return { name: readRequired(formData, "name"), account_number: readRequired(formData, "account_number"), opening_balance: Math.round(openingBalance * 100) / 100 };
}

export async function createAccountAction(formData: FormData) {
  await insertAccount(readAccount(formData));
  revalidatePath("/", "layout");
  goWithMessage("/accounts", "Bank account created.");
}

export async function updateAccountAction(id: string, formData: FormData) {
  await updateAccount(id, readAccount(formData));
  revalidatePath("/", "layout");
  goWithMessage("/accounts", "Bank account updated.");
}

export async function deleteAccountAction(id: string) {
  await removeAccount(id);
  revalidatePath("/", "layout");
  goWithMessage("/accounts", "Bank account and its transactions deleted.");
}
