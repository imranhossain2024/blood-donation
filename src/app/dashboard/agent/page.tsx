
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardShell from "@/components/DashboardShell";
import Link from "next/link";
import { Suspense } from "react";
import AgentDonorList from "@/components/AgentDonorList";

export default async function AgentDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "AGENT") {
    return (
      <DashboardShell title="Unauthorized" description="Access denied.">
        <div className="card text-error">You do not have permission to view this page.</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell 
      title="Agent Dashboard" 
      description={`Managing donors in ${session.user.agentArea ?? "assigned area"}`}
    >
      <div className="mb-8">
        <Link 
          href="/dashboard/agent/requests" 
          className="card flex items-center justify-between hover:border-brand-300 transition-colors group"
        >
          <div>
            <h3 className="font-bold text-lg text-brand-900 group-hover:text-brand-700">Manage Blood Requests</h3>
            <p className="text-sm text-ink/60">View and approve pending blood requests in your area.</p>
          </div>
          <span className="text-2xl">→</span>
        </Link>
      </div>

      <Suspense fallback={<div className="card text-center py-12 animate-pulse">Loading Donors...</div>}>
        <AgentDonorList agentArea={session.user.agentArea} agentId={session.user.id} />
      </Suspense>
    </DashboardShell>
  );
}
