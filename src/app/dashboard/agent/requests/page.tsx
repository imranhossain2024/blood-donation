
import AgentRequestCard from "@/components/AgentRequestCard";
import DashboardShell from "@/components/DashboardShell";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AgentRequestsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "AGENT") {
    redirect("/dashboard");
  }

  const agentArea = (session.user.agentArea || "").trim();
  
  // SERVER-SIDE DEBUG LOGGING
  console.log(`[AgentRequests] Fetching for Agent: ${session.user.email} | Area: "${agentArea}"`);

  let pendingRequests: (import("@prisma/client").BloodRequest & {
    requester: { name: string | null; email: string | null; phone: string | null }
  })[] = [];
  // let error = null; // Removed if unused or prefix with _
  let error = null;

  try {
    // Normalize filtering logic
    const whereClause: import("@prisma/client").Prisma.BloodRequestWhereInput = {
      status: "PENDING",
    };

    if (agentArea) {
      whereClause.location = {
        contains: agentArea,
        mode: "insensitive",
      };
    }

    pendingRequests = await prisma.bloodRequest.findMany({
      where: whereClause,
      include: {
        requester: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    
    console.log(`[AgentRequests] Found ${pendingRequests.length} results.`);
  } catch (e) {
    console.error("[AgentRequests] Database error:", e);
    error = "Failed to load requests from database.";
  }

  if (error) {
    return (
      <DashboardShell title="Pending Requests" description="Database Error">
        <div className="card text-error">{error}</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell 
      title="Pending Requests" 
      description={agentArea ? `Review requests within "${agentArea}"` : "Review all pending requests (No area assigned)"}
    >
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard/agent" className="text-sm text-brand-600 hover:underline">
          ← Back to Dashboard
        </Link>
        {!agentArea && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
            ⚠️ No area assigned to your profile
          </span>
        )}
      </div>

      {pendingRequests.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-xl font-semibold">No Pending Requests</h3>
          <p className="mt-2 text-sm text-ink/70">
            {agentArea 
              ? `No pending requests were found in "${agentArea}".`
              : "There are no pending requests globally at this moment."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingRequests.map((request) => (
            <AgentRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
