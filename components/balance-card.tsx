import { formatCurrency, maskAccountNumber } from "@/lib/format";
import type { AccountBalance } from "@/lib/types";

export function BalanceCard({ account }: { account: AccountBalance }) {
  const low = account.available_balance >= 0 && account.opening_balance > 0 && account.available_balance < account.opening_balance * 0.1;
  const negative = account.available_balance < 0;
  return <article className={`balance-card ${negative ? "negative" : low ? "low" : ""}`}>
    <div className="card-top"><div><h2>{account.name}</h2><p>{maskAccountNumber(account.account_number)}</p></div><span className={`balance-status ${negative ? "negative" : low ? "low" : "healthy"}`}>{negative ? "Shortfall" : low ? "Low balance" : "Healthy"}</span></div>
    <p className="balance-label">Available balance</p>
    <p className="balance-value">{formatCurrency(account.available_balance)}</p>
    <div className="balance-breakdown"><span><small>Opening</small>{formatCurrency(account.opening_balance)}</span><span className="inflow"><small>Cleared receipts</small>+{formatCurrency(account.total_receipts)}</span><span className="outflow"><small>Payments</small>−{formatCurrency(account.total_payments)}</span></div>
    {negative && <p className="card-warning">Do NOT approve payments in Maybank2e.</p>}
    {low && <p className="card-warning amber">Available funds are below 10% of the opening balance.</p>}
  </article>;
}
