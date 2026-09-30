"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ idleLabel, pendingLabel = "Saving…" }: { idleLabel: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return <button className="button primary" type="submit" disabled={pending} aria-disabled={pending}>{pending ? pendingLabel : idleLabel}</button>;
}
