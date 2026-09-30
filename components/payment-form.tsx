import Link from "next/link";
import type { BankAccount, Payment } from "@/lib/types";

export function PaymentForm({ accounts, payment, action }: { accounts: BankAccount[]; payment?: Payment; action: (formData: FormData) => void | Promise<void> }) {
  return <form action={action} className="form-card">
    <div className="form-grid">
      <label className="field full"><span>Bank account</span><select name="bank_account_id" required defaultValue={payment?.bank_account_id ?? ""}><option value="" disabled>Select an account</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
      <label className="field"><span>Payee</span><input name="payee" required maxLength={160} defaultValue={payment?.payee} placeholder="Vendor or recipient" /></label>
      <label className="field"><span>Invoice reference</span><input name="invoice_ref" maxLength={100} defaultValue={payment?.invoice_ref ?? ""} placeholder="INV-001" /></label>
      <label className="field"><span>Amount (RM)</span><input name="amount" type="number" required min="0.01" step="0.01" defaultValue={payment?.amount} placeholder="0.00" /></label>
      <label className="field"><span>Payment date</span><input name="payment_date" type="date" required defaultValue={payment?.payment_date ?? new Date().toISOString().slice(0, 10)} /></label>
      <label className="check-field full"><input name="cleared" type="checkbox" defaultChecked={payment?.cleared} /><span><strong>Cleared in Maybank2e</strong><small>Mark this only when the payment has settled.</small></span></label>
    </div>
    <div className="form-actions"><Link href="/payments" className="button secondary">Cancel</Link><button className="button primary" type="submit">{payment ? "Save changes" : "Create payment"}</button></div>
  </form>;
}
