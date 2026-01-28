import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/donor", label: "Donor" },
  { href: "/dashboard/requests", label: "Requests" },
  { href: "/dashboard/admin", label: "Admin" },
];

type DashboardShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function DashboardShell({ title, description, children }: DashboardShellProps) {
  return (
    <section className="container-pad grid gap-8 py-12 md:grid-cols-[220px_1fr]">
      <aside className="space-y-3">
        <div className="rounded-2xl bg-white/80 p-4 shadow-card">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Dashboard
          </div>
          <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
          {description ? <p className="mt-2 text-sm text-ink/70">{description}</p> : null}
        </div>
        <nav className="space-y-2 text-sm font-semibold text-ink/70">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-2xl border border-brand-100 bg-white/80 px-4 py-3 transition hover:border-brand-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="space-y-6">{children}</div>
    </section>
  );
}
