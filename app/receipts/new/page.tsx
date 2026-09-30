import { PageHeader } from "@/components/page-header";
import { ReceiptForm } from "@/components/receipt-form";
import { createReceiptAction } from "@/lib/actions/receipt-actions";
import { getAccounts } from "@/lib/data/accounts";

export default async function NewReceiptPage() { const accounts = await getAccounts(); return <div className="page-wrap narrow"><PageHeader eyebrow="Receipts" title="Record a receipt" description="Available funds increase immediately after this receipt is saved." />{accounts.length ? <ReceiptForm accounts={accounts} action={createReceiptAction} /> : <div className="empty-state panel"><h2>Add a bank account first</h2><p>Receipts need an account to credit.</p></div>}</div>; }
