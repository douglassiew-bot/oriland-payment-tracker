import Link from "next/link";

export function PageHeader({ eyebrow, title, description, actionHref, actionLabel }: { eyebrow: string; title: string; description: string; actionHref?: string; actionLabel?: string }) {
  return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>{actionHref && actionLabel && <Link className="button primary" href={actionHref}>＋ {actionLabel}</Link>}</div>;
}
