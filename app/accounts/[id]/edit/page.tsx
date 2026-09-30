import { notFound } from "next/navigation";
import { AccountForm } from "@/components/account-form";
import { PageHeader } from "@/components/page-header";
import { updateAccountAction } from "@/lib/actions/account-actions";
import { getAccount } from "@/lib/data/accounts";

export default async function EditAccountPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const account = await getAccount(id); if (!account) notFound(); return <div className="page-wrap narrow"><PageHeader eyebrow="Bank accounts" title="Edit bank account" description="Changing the opening balance immediately changes available funds." /><AccountForm account={account} action={updateAccountAction.bind(null, id)} /></div>; }
