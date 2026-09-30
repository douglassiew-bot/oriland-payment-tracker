import { PageHeader } from "@/components/page-header";
import { PaymentForm } from "@/components/payment-form";
import { createPaymentAction } from "@/lib/actions/payment-actions";
import { getAccounts } from "@/lib/data/accounts";
import { FlashMessage } from "@/components/flash-message";

export default async function NewPaymentPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const [accounts, query] = await Promise.all([getAccounts(), searchParams]); return <div className="page-wrap narrow"><PageHeader eyebrow="Payments" title="Create a payment" description="The available balance will be checked as soon as you submit." /><FlashMessage {...query} />{accounts.length ? <PaymentForm accounts={accounts} action={createPaymentAction} /> : <div className="empty-state panel"><h2>Add a bank account first</h2><p>Payments need an account to draw funds from.</p></div>}</div>; }
