import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PaymentForm } from "@/components/payment-form";
import { updatePaymentAction } from "@/lib/actions/payment-actions";
import { getAccounts } from "@/lib/data/accounts";
import { getPayment } from "@/lib/data/payments";

export default async function EditPaymentPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const [payment, accounts] = await Promise.all([getPayment(id), getAccounts()]); if (!payment) notFound(); return <div className="page-wrap narrow"><PageHeader eyebrow="Payments" title="Edit payment" description="Changes are reflected in the live available balance immediately." /><PaymentForm accounts={accounts} payment={payment} action={updatePaymentAction.bind(null, id)} /></div>; }
