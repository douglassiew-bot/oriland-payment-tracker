import Link from "next/link";
import { DeleteButton } from "@/components/delete-button";
import { FlashMessage } from "@/components/flash-message";
import { PageHeader } from "@/components/page-header";
import { deleteReceiptAction, toggleReceiptAction } from "@/lib/actions/receipt-actions";
import { getReceipts } from "@/lib/data/receipts";
import { formatCurrency, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReceiptsPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const [receipts, query] = await Promise.all([getReceipts(), searchParams]);
  return <div className="page-wrap"><PageHeader eyebrow="Incoming funds" title="Receipts" description="Record cash inflows and confirm them against the bank statement." actionHref="/receipts/new" actionLabel="New receipt" /><FlashMessage {...query} />
    {receipts.length === 0 ? <div className="empty-state panel"><h2>No receipts yet</h2><p>Record your first receipt to increase the live available balance.</p><Link href="/receipts/new" className="button primary">Create your first receipt</Link></div> : <div className="panel table-wrap"><table><thead><tr><th>Source</th><th>Account</th><th>Date</th><th>Amount</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{receipts.map((receipt) => <tr key={receipt.id}><td><strong>{receipt.source}</strong><small>{receipt.reference || "No reference"}</small></td><td>{receipt.bank_accounts?.name ?? "Unknown account"}</td><td>{formatDate(receipt.receipt_date)}</td><td className="money-in">+{formatCurrency(receipt.amount)}</td><td><form action={toggleReceiptAction.bind(null, receipt.id)}><input type="hidden" name="cleared" value={String(!receipt.cleared)} /><button type="submit" className={`status-pill ${receipt.cleared ? "cleared" : "pending"}`}>{receipt.cleared ? "✓ Cleared" : "Pending"}</button></form></td><td><div className="row-actions"><Link className="text-button" href={`/receipts/${receipt.id}/edit`}>Edit</Link><form action={deleteReceiptAction.bind(null, receipt.id)}><DeleteButton /></form></div></td></tr>)}</tbody></table></div>}
  </div>;
}
