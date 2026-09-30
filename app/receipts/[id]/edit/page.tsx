import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ReceiptForm } from "@/components/receipt-form";
import { updateReceiptAction } from "@/lib/actions/receipt-actions";
import { getAccounts } from "@/lib/data/accounts";
import { getReceipt } from "@/lib/data/receipts";

export default async function EditReceiptPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const [receipt, accounts] = await Promise.all([getReceipt(id), getAccounts()]); if (!receipt) notFound(); return <div className="page-wrap narrow"><PageHeader eyebrow="Receipts" title="Edit receipt" description="Changes are reflected in the live available balance immediately." /><ReceiptForm accounts={accounts} receipt={receipt} action={updateReceiptAction.bind(null, id)} /></div>; }
