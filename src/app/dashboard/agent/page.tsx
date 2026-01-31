import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import { bloodGroupLabels } from "@/lib/utils";
import Link from "next/link";

export default async function AgentDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "AGENT") {
    return (
      <DashboardShell title="Unauthorized" description="Access denied.">
        <div className="card text-error">You do not have permission to view this page.</div>
      </DashboardShell>
    );
  }

  // Fetch donors in agent's area
  const donors = await prisma.donorProfile.findMany({
    where: { 
      OR: [
        { area: session.user.agentArea },
        { agentId: session.user.id }
      ]
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell 
      title="Agent Dashboard" 
      description={`Managing donors in ${session.user.agentArea ?? "assigned area"}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Donors in Your Area</h2>
        <span className="pill bg-brand-100 text-brand-800">{donors.length} total</span>
      </div>

      {donors.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-lg font-semibold">No donors found</h3>
          <p className="text-sm text-ink/60">There are no donors currently registered in your area.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {donors.map((donor) => (
            <div key={donor.id} className="card group hover:border-brand-300 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-brand-900 group-hover:text-brand-700 transition-colors">
                    {donor.user?.name || "Anonymous Donor"}
                  </h3>
                  <p className="text-xs text-ink/50 uppercase tracking-widest">{donor.location}</p>
                </div>
                <div className="text-right">
                <div className="text-2xl font-bold text-brand-600">{bloodGroupLabels[donor.bloodGroup]}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-50">
                <span className={`pill ${donor.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {donor.approved ? "Approved" : "Pending Approval"}
                </span>
                <Link 
                  href={`/dashboard/agent/donor/${donor.id}`} 
                  className="text-sm font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                >
                  Manage Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
