import Link from "next/link";
import { BalanceCard } from "@/components/balance-card";
import { PageHeader } from "@/components/page-header";
import { getAccountsWithBalances } from "@/lib/actions/balance";
import { getPayments } from "@/lib/data/payments";
import { getReceipts } from "@/lib/data/receipts";
import { formatCurrency, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [accounts, payments, receipts] = await Promise.all([getAccountsWithBalances(), getPayments(5), getReceipts(5)]);
  const total = accounts.reduce((sum, account) => sum + account.available_balance, 0);
  const activity = [
    ...payments.map((item) => ({ id: item.id, date: item.payment_date, label: item.payee, reference: item.invoice_ref, amount: -item.amount, kind: "Payment" })),
    ...receipts.map((item) => ({ id: item.id, date: item.receipt_date, label: item.source, reference: item.reference, amount: item.amount, kind: "Receipt" })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  return <div className="page-wrap">
    <PageHeader eyebrow="Finance workspace" title="Good overview, better decisions." description="Live available balances across every tracked account." actionHref="/payments/new" actionLabel="New payment" />
    <section className="hero-summary"><div><p>Total available balance</p><strong>{formatCurrency(total)}</strong><span>Across {accounts.length} bank {accounts.length === 1 ? "account" : "accounts"}</span></div><div className="hero-actions"><Link href="/receipts/new" className="button light">＋ Record receipt</Link><Link href="/accounts" className="button ghost-light">View accounts →</Link></div></section>
    <div className="section-heading"><div><p className="eyebrow">Balances</p><h2>Bank accounts</h2></div><Link href="/accounts">Manage accounts →</Link></div>
    <section className="balance-grid">{accounts.map((account) => <BalanceCard account={account} key={account.id} />)}</section>
    <div className="section-heading"><div><p className="eyebrow">Ledger</p><h2>Recent activity</h2></div></div>
    <section className="panel activity-list">{activity.length === 0 ? <div className="empty-state"><h3>No activity yet</h3><p>Create a payment or receipt to start tracking cash flow.</p></div> : activity.map((item) => <div className="activity-row" key={`${item.kind}-${item.id}`}><span className={`activity-icon ${item.amount > 0 ? "in" : "out"}`}>{item.amount > 0 ? "↙" : "↗"}</span><div className="activity-copy"><strong>{item.label}</strong><span>{item.kind} · {item.reference || "No reference"} · {formatDate(item.date)}</span></div><strong className={item.amount > 0 ? "money-in" : "money-out"}>{item.amount > 0 ? "+" : "−"}{formatCurrency(Math.abs(item.amount))}</strong></div>)}</section>
  </div>;
}
