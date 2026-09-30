"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Dashboard", icon: "⌂" },
  { href: "/accounts", label: "Bank accounts", icon: "▣" },
  { href: "/payments", label: "Payments", icon: "↗" },
  { href: "/receipts", label: "Receipts", icon: "↙" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <header className="mobile-header">
        <Link href="/" className="brand"><span className="brand-mark">O</span><span>Oriland Finance</span></Link>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>☰</button>
      </header>
      {open && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <Link href="/" className="brand desktop-brand" onClick={() => setOpen(false)}><span className="brand-mark">O</span><span>Oriland Finance</span></Link>
        <p className="nav-label">Workspace</p>
        <nav aria-label="Primary navigation">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return <Link key={link.href} href={link.href} className={`nav-link ${active ? "active" : ""}`} onClick={() => setOpen(false)}><span className="nav-icon">{link.icon}</span>{link.label}</Link>;
          })}
        </nav>
        <div className="sidebar-note"><span className="status-dot" />Live balance tracking<p>Shared finance workspace</p></div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
