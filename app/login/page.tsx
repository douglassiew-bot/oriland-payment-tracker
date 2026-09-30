import { redirect } from "next/navigation";
import { signInAction } from "@/lib/actions/auth-actions";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; email?: string; next?: string }> }) {
  const [query, supabase] = await Promise.all([searchParams, createClient()]);
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/");

  return <div className="auth-page">
    <section className="auth-panel">
      <div className="auth-wordmark"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>Oriland</span></div>
      <p className="eyebrow">Protected finance workspace</p>
      <h1>Sign in to the ledger</h1>
      <p className="page-description">Access is limited to manually provisioned Oriland finance team accounts.</p>
      {query.error && <div className="alert alert-danger auth-alert" role="alert"><span className="alert-icon">!</span><div><strong>Sign-in failed</strong><p>{query.error}</p></div></div>}
      <form action={signInAction} className="auth-form">
        <input type="hidden" name="next" value={query.next ?? "/"} />
        <label className="field"><span>Email address</span><input name="email" type="email" autoComplete="email" required defaultValue={query.email} autoFocus /></label>
        <label className="field"><span>Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
        <button className="button primary auth-submit" type="submit">Sign in</button>
      </form>
      <p className="auth-note">No public sign-up. Contact the workspace owner if you need access.</p>
    </section>
    <aside className="auth-aside"><p>ORILAND / FINANCE CONTROL</p><strong>One shared ledger.<br />Only the right people.</strong><span>Account balances, committed payments, receipts, and every mutation are protected and auditable.</span></aside>
  </div>;
}
