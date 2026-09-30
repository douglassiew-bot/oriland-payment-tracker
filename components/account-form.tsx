import Link from "next/link";
import type { BankAccount } from "@/lib/types";

export function AccountForm({ account, action }: { account?: BankAccount; action: (formData: FormData) => void | Promise<void> }) {
  return <form action={action} className="form-card"><div className="form-grid">
    <label className="field full"><span>Account name</span><input name="name" required maxLength={160} defaultValue={account?.name} placeholder="Maybank Operating Account" /></label>
    <label className="field"><span>Account number</span><input name="account_number" required maxLength={40} defaultValue={account?.account_number} placeholder="5621 8890 3341" /></label>
    <label className="field"><span>Opening balance (RM)</span><input name="opening_balance" type="number" min="0" step="0.01" required defaultValue={account?.opening_balance} placeholder="0.00" /></label>
  </div><div className="form-actions"><Link href="/accounts" className="button secondary">Cancel</Link><button type="submit" className="button primary">{account ? "Save changes" : "Create account"}</button></div></form>;
}
