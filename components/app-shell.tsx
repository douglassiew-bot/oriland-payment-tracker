"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOutAction } from "@/lib/actions/auth-actions";

const links = [
  { href: "/", label: "Overview", index: "01" },
  { href: "/accounts", label: "Accounts", index: "02" },
  { href: "/payments", label: "Payments", index: "03" },
  { href: "/receipts", label: "Receipts", index: "04" },
];

export function AppShell({ children, viewer }: { children: React.ReactNode; viewer: { email: string | null; workspaceName: string | null } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (pathname === "/login") return <main className="auth-layout">{children}</main>;
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Oriland</span>
        </Link>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open ? "Close" : "Menu"}</button>
        <div className={`nav-drawer ${open ? "nav-open" : ""}`}>
          <nav className="primary-nav" aria-label="Primary navigation">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return <Link key={link.href} href={link.href} className={`nav-link ${active ? "active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}><span>{link.index}</span>{link.label}</Link>;
          })}
          </nav>
          <div className="header-tools">
            <span className="currency-chip">MYR&nbsp; (RM)</span>
            <Link href="/payments/new" className="header-action"><span>＋</span> Record payment</Link>
            <div className="workspace-id"><span className="status-dot" /><span>{viewer.workspaceName ?? "Access pending"}<small>{viewer.email ?? "Authenticated account"}</small></span></div>
            {viewer.email && <form action={signOutAction}><button className="sign-out-button" type="submit">Sign out</button></form>}
          </div>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Oriland</span><span>Quiet financial clarity / MYR ledger</span><span><span className="status-dot" />Authenticated workspace</span></footer>
    </div>
  );
}
