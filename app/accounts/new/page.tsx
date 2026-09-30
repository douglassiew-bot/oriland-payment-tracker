import { AccountForm } from "@/components/account-form";
import { PageHeader } from "@/components/page-header";
import { createAccountAction } from "@/lib/actions/account-actions";
import { FlashMessage } from "@/components/flash-message";

export default async function NewAccountPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const query = await searchParams; return <div className="page-wrap narrow"><PageHeader eyebrow="Bank accounts" title="Add a bank account" description="Set the opening balance for this tracking period." /><FlashMessage {...query} /><AccountForm action={createAccountAction} /></div>; }
