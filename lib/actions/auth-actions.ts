"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { readRequired } from "@/lib/actions/helpers";

function safeNextPath(value: FormDataEntryValue | null) {
  const path = String(value ?? "/");
  return path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

export async function signInAction(formData: FormData) {
  const email = readRequired(formData, "email").toLowerCase();
  const password = readRequired(formData, "password");
  const next = safeNextPath(formData.get("next"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const query = new URLSearchParams({ error: "Email or password is incorrect.", email, next });
    redirect(`/login?${query.toString()}`);
  }

  redirect(next);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
