"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  ShieldCheck, 
  UserCircle,
  Activity
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";


type DashboardShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict?: any;
};

export default function DashboardShell({
  title,
  description,
  children,
  dict,
}: DashboardShellProps) {
  const pathname = usePathname() ?? "/";
  const { role } = useDashboard(); // Uses cached role for instant load

  const links = [
    { href: "/dashboard", label: dict?.dashboardNav?.overview || "Overview", icon: LayoutDashboard },
    { href: "/dashboard/requests", label: dict?.dashboardNav?.requests || "Requests", icon: ClipboardList },
    { href: "/profile", label: dict?.dashboardNav?.profile || "Profile", icon: UserCircle },
  ];

  if (role === "DONOR" || role === "USER") links.splice(1, 0, { href: "/dashboard/donor", label: dict?.dashboardNav?.donorCenter || "Donor Center", icon: Activity });
  if (role === "AGENT") links.splice(1, 0, { href: "/dashboard/agent", label: dict?.dashboardNav?.agentPanel || "Agent Panel", icon: Users });
  if (role === "ADMIN") {
    links.push({ href: "/dashboard/admin", label: dict?.dashboardNav?.adminPanel || "Admin Panel", icon: ShieldCheck });
    links.splice(1, 0, { href: "/donors", label: dict?.dashboardNav?.findDonors || "Find Donors", icon: Users });
  }

  return (
    <section className="container-pad grid gap-8 py-12 md:grid-cols-[240px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm border border-brand-100">
          <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-bold mb-2">
            {dict?.dashboardNav?.controlPanel || "Control Panel"}
          </div>
          <h2 className="text-xl font-bold text-brand-900 leading-tight">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs text-ink/60 line-clamp-2">{description}</p>
          ) : null}
        </div>
        <nav
          className="flex flex-row space-x-2 overflow-x-auto pb-2 scrollbar-hide md:flex-col md:space-x-0 md:space-y-1.5 md:pb-0"
          aria-label="Dashboard navigation"
        >
          {links.map((link) => {
            const isRoot = link.href === "/dashboard";
            const isActive = isRoot
              ? pathname === "/dashboard"
              : pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "border-brand-600 bg-brand-600 text-white shadow-md"
                    : "border-transparent bg-white/40 text-ink/70 hover:border-brand-100 hover:bg-white hover:text-brand-700 hover:shadow-sm"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-brand-500"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="space-y-6">{children}</div>
    </section>
  );
}
