import { redirect } from "next/navigation";

export function readRequired(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`${key.replaceAll("_", " ")} is required.`);
  return value;
}

export function readAmount(formData: FormData, key: string) {
  const amount = Number(formData.get(key));
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Amount must be greater than zero.");
  return Math.round(amount * 100) / 100;
}

export function goWithMessage(path: string, message: string, type: "success" | "error" = "success") {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
