import Link from "next/link";
import { DeleteButton } from "@/components/delete-button";
import { FlashMessage } from "@/components/flash-message";
import { PageHeader } from "@/components/page-header";
import { deletePaymentAction, togglePaymentAction } from "@/lib/actions/payment-actions";
import { getPayments } from "@/lib/data/payments";
import { formatCurrency, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const [payments, query] = await Promise.all([getPayments(), searchParams]);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return <div className="page-wrap"><PageHeader eyebrow="Outgoing funds" title="Payments" description="Track committed outflows before approving them in Maybank2e." actionHref="/payments/new" actionLabel="New payment" /><FlashMessage {...query} />
    {payments.length === 0 ? <div className="empty-state panel"><h2>No payments yet</h2><p>Create your first payment to see its impact on available funds.</p><Link href="/payments/new" className="button primary">Create your first payment</Link></div> : <div className="panel table-wrap"><table><thead><tr><th>Payee</th><th>Account</th><th>Date</th><th>Amount</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{payments.map((payment) => { const age = Math.floor((today.getTime() - new Date(`${payment.payment_date}T00:00:00`).getTime()) / 86400000); const stale = !payment.cleared && age > 3; return <tr key={payment.id}><td><strong>{payment.payee}</strong><small>{payment.invoice_ref || "No reference"}</small></td><td>{payment.bank_accounts?.name ?? "Unknown account"}</td><td>{formatDate(payment.payment_date)}</td><td className="money-out">−{formatCurrency(payment.amount)}</td><td><form action={togglePaymentAction.bind(null, payment.id)}><input type="hidden" name="cleared" value={String(!payment.cleared)} /><button type="submit" className={`status-pill ${payment.cleared ? "cleared" : "pending"}`}>{payment.cleared ? "✓ Cleared" : stale ? `Pending · ${age}d` : "Pending"}</button></form>{stale && <small className="stale-note">Needs follow-up</small>}</td><td><div className="row-actions"><Link className="text-button" href={`/payments/${payment.id}/edit`}>Edit</Link><form action={deletePaymentAction.bind(null, payment.id)}><DeleteButton /></form></div></td></tr>; })}</tbody></table></div>}
  </div>;
}
