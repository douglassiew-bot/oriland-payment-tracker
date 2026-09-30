import { signOutAction } from "@/lib/actions/auth-actions";

export default function NoAccessPage() {
  return <div className="page-wrap narrow"><section className="empty-state panel"><span className="error-mark">!</span><p className="eyebrow">Workspace access</p><h1>Your account is not provisioned</h1><p>You are signed in, but this account is not a member of the Oriland Finance workspace. Ask the workspace owner to add your email, then sign in again.</p><form action={signOutAction}><button className="button primary" type="submit">Return to sign in</button></form></section></div>;
}
