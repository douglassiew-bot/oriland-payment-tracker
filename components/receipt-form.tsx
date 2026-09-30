import Link from "next/link";
import type { BankAccount, Receipt } from "@/lib/types";
import { SubmitButton } from "@/components/submit-button";

export function ReceiptForm({ accounts, receipt, action }: { accounts: BankAccount[]; receipt?: Receipt; action: (formData: FormData) => void | Promise<void> }) {
  return <form action={action} className="form-card">
    <div className="form-grid">
      <label className="field full"><span>Bank account</span><select name="bank_account_id" required defaultValue={receipt?.bank_account_id ?? ""}><option value="" disabled>Select an account</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
      <label className="field"><span>Source</span><input name="source" required maxLength={160} defaultValue={receipt?.source} placeholder="Customer or sender" /></label>
      <label className="field"><span>Reference</span><input name="reference" maxLength={100} defaultValue={receipt?.reference ?? ""} placeholder="REM-001" /></label>
      <label className="field"><span>Amount (RM)</span><input name="amount" type="number" required min="0.01" step="0.01" defaultValue={receipt?.amount} placeholder="0.00" /></label>
      <label className="field"><span>Receipt date</span><input name="receipt_date" type="date" required defaultValue={receipt?.receipt_date ?? new Date().toISOString().slice(0, 10)} /></label>
      <label className="check-field full"><input name="cleared" type="checkbox" defaultChecked={receipt?.cleared} /><span><strong>Visible in bank statement</strong><small>Mark this when the receipt is confirmed by the bank.</small></span></label>
    </div>
    <div className="form-actions"><Link href="/receipts" className="button secondary">Cancel</Link><SubmitButton idleLabel={receipt ? "Save changes" : "Create receipt"} /></div>
  </form>;
}
