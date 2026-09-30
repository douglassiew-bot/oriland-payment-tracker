import { PageHeader } from "@/components/page-header";
import { PaymentForm } from "@/components/payment-form";
import { createPaymentAction } from "@/lib/actions/payment-actions";
import { getAccounts } from "@/lib/data/accounts";

export default async function NewPaymentPage() { const accounts = await getAccounts(); return <div className="page-wrap narrow"><PageHeader eyebrow="Payments" title="Create a payment" description="The available balance will be checked as soon as you submit." />{accounts.length ? <PaymentForm accounts={accounts} action={createPaymentAction} /> : <div className="empty-state panel"><h2>Add a bank account first</h2><p>Payments need an account to draw funds from.</p></div>}</div>; }
