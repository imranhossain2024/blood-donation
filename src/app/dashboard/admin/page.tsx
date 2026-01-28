import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import { setDonorApproval, setDonorBlocked, adminUpdateRequestStatus } from "@/app/actions/admin";
import { bloodGroupLabels } from "@/lib/utils";

const statuses = ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"] as const;

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const [totalUsers, totalDonors, totalRequests, pendingDonors, recentRequests, statusCounts] =
    await Promise.all([
      prisma.user.count(),
      prisma.donorProfile.count({ where: { approved: true, blocked: false } }),
      prisma.bloodRequest.count(),
      prisma.donorProfile.findMany({
        where: { approved: false, blocked: false },
        include: { user: true },
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
      prisma.bloodRequest.findMany({
        include: { requester: true, donor: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      Promise.all(statuses.map((status) => prisma.bloodRequest.count({ where: { status } }))),
    ]);

  const requestStatus = statuses.map((status, index) => ({
    status,
    count: statusCounts[index] ?? 0,
  }));

  return (
    <DashboardShell
      title="Admin Control"
      description="Approve donors, track requests, and monitor analytics."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Total users", value: totalUsers },
          { label: "Approved donors", value: totalDonors },
          { label: "Total requests", value: totalRequests },
        ].map((item) => (
          <div key={item.label} className="card">
            <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
              {item.label}
            </div>
            <h3 className="mt-2 text-3xl font-semibold">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Request status mix
          </div>
          <div className="mt-6 space-y-3">
            {requestStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between text-sm">
                <span>{item.status}</span>
                <div className="flex w-2/3 items-center gap-3">
                  <div
                    className="h-2 flex-1 rounded-full bg-brand-100"
                    style={{
                      backgroundImage: `linear-gradient(90deg, #f23e3e ${(item.count / Math.max(totalRequests, 1)) * 100}%, #f0e7e2 ${(item.count / Math.max(totalRequests, 1)) * 100}%)`,
                    }}
                  />
                  <span className="w-10 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Pending donor approvals
          </div>
          <div className="mt-4 space-y-4">
            {pendingDonors.length ? (
              pendingDonors.map((donor) => (
                <div key={donor.id} className="rounded-2xl border border-brand-100 p-4">
                  <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
                    {bloodGroupLabels[donor.bloodGroup]} - {donor.location}
                  </div>
                  <h4 className="mt-2 text-lg font-semibold">
                    {donor.user.name ?? "Anonymous"}
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <form action={setDonorApproval.bind(null, donor.userId, true)}>
                      <button type="submit" className="btn btn-primary">
                        Approve
                      </button>
                    </form>
                    <form action={setDonorBlocked.bind(null, donor.userId, true)}>
                      <button type="submit" className="btn btn-outline">
                        Block
                      </button>
                    </form>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink/70">No pending donors.</p>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Recent requests</h3>
        </div>
        <div className="grid gap-4">
          {recentRequests.length ? (
            recentRequests.map((request) => (
              <div key={request.id} className="card">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
                      {request.requester?.name ?? "Requester"} � {request.location}
                    </div>
                    <h4 className="mt-2 text-xl font-semibold">
                      {bloodGroupLabels[request.bloodGroup]} � {request.units} units
                    </h4>
                    <p className="mt-1 text-sm text-ink/70">
                      Status: {request.status}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {request.status === "PENDING" ? (
                      <>
                        <form action={adminUpdateRequestStatus.bind(null, request.id, "ACCEPTED")}>
                          <button type="submit" className="btn btn-primary">
                            Approve
                          </button>
                        </form>
                        <form action={adminUpdateRequestStatus.bind(null, request.id, "REJECTED")}>
                          <button type="submit" className="btn btn-outline">
                            Reject
                          </button>
                        </form>
                      </>
                    ) : null}
                    {request.status === "ACCEPTED" ? (
                      <form action={adminUpdateRequestStatus.bind(null, request.id, "COMPLETED")}>
                        <button type="submit" className="btn btn-primary">
                          Complete
                        </button>
                      </form>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card">No recent requests.</div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}









