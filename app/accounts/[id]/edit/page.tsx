import { notFound } from "next/navigation";
import { AccountForm } from "@/components/account-form";
import { PageHeader } from "@/components/page-header";
import { updateAccountAction } from "@/lib/actions/account-actions";
import { getAccount } from "@/lib/data/accounts";
import { FlashMessage } from "@/components/flash-message";

export default async function EditAccountPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) { const [{ id }, query] = await Promise.all([params, searchParams]); const account = await getAccount(id); if (!account) notFound(); return <div className="page-wrap narrow"><PageHeader eyebrow="Bank accounts" title="Edit bank account" description="Changing the opening balance immediately changes available funds." /><FlashMessage {...query} /><AccountForm account={account} action={updateAccountAction.bind(null, id)} /></div>; }
