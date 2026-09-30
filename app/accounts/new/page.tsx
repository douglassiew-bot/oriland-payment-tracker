import { AccountForm } from "@/components/account-form";
import { PageHeader } from "@/components/page-header";
import { createAccountAction } from "@/lib/actions/account-actions";

export default function NewAccountPage() { return <div className="page-wrap narrow"><PageHeader eyebrow="Bank accounts" title="Add a bank account" description="Set the opening balance for this tracking period." /><AccountForm action={createAccountAction} /></div>; }
