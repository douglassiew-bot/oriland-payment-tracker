import Link from "next/link";
import { BalanceCard } from "@/components/balance-card";
import { DeleteButton } from "@/components/delete-button";
import { FlashMessage } from "@/components/flash-message";
import { PageHeader } from "@/components/page-header";
import { deleteAccountAction } from "@/lib/actions/account-actions";
import { getAccountsWithBalances } from "@/lib/actions/balance";

export const dynamic = "force-dynamic";

export default async function AccountsPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const [accounts, query] = await Promise.all([getAccountsWithBalances(), searchParams]);
  return <div className="page-wrap"><PageHeader eyebrow="Cash position" title="Bank accounts" description="Opening balances and live available funds in one view." actionHref="/accounts/new" actionLabel="Add account" /><FlashMessage {...query} />
    {accounts.length === 0 ? <div className="empty-state panel"><h2>No bank accounts yet</h2><p>Add an account before recording payments or receipts.</p><Link href="/accounts/new" className="button primary">Create your first account</Link></div> : <section className="balance-grid">{accounts.map((account) => <div key={account.id}><BalanceCard account={account} /><div className="card-actions"><Link href={`/accounts/${account.id}/edit`} className="text-button">Edit</Link><form action={deleteAccountAction.bind(null, account.id)}><DeleteButton /></form></div></div>)}</section>}
  </div>;
}
