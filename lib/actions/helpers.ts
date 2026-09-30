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

export function goWithMessage(path: string, message: string, type: "success" | "error" = "success"): never {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function actionError(error: unknown, fallback: string) {
  if (error instanceof Error && (error.message.includes("required") || error.message.includes("must be"))) return error.message;
  return fallback;
}
