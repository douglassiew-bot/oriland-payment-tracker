import { PageHeader } from "@/components/page-header";
import { ReceiptForm } from "@/components/receipt-form";
import { createReceiptAction } from "@/lib/actions/receipt-actions";
import { getAccounts } from "@/lib/data/accounts";
import { FlashMessage } from "@/components/flash-message";

export default async function NewReceiptPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const [accounts, query] = await Promise.all([getAccounts(), searchParams]); return <div className="page-wrap narrow"><PageHeader eyebrow="Receipts" title="Record a receipt" description="Available funds increase immediately after this receipt is saved." /><FlashMessage {...query} />{accounts.length ? <ReceiptForm accounts={accounts} action={createReceiptAction} /> : <div className="empty-state panel"><h2>Add a bank account first</h2><p>Receipts need an account to credit.</p></div>}</div>; }
