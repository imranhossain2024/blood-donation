import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import DashboardShell from "@/components/DashboardShell";
import { setDonorApproval, setDonorBlocked, adminUpdateRequestStatus } from "@/app/actions/admin";
import { dismissReport } from "@/app/actions/report";
import { bloodGroupLabels } from "@/lib/utils";
import Link from "next/link";

const statuses = ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"] as const;

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const [totalUsers, totalDonors, totalRequests, pendingDonors, recentRequests, reports, statusCounts] =
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
      prisma.report.findMany({
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
      title="Admin Control Panel"
      description="Manage donors, requests, and view analytics."
    >
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {[ 
          { label: "Total Users", value: totalUsers, icon: "👥", color: "text-blue-600" },
          { label: "Approved Donors", value: totalDonors, icon: "🩸", color: "text-brand-600" },
          { label: "Total Requests", value: totalRequests, icon: "📋", color: "text-orange-600" },
        ].map((item) => (
          <div key={item.label} className="card relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-110 transition-transform">{item.icon}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink/50 font-bold mb-1">{item.label}</div>
            <h3 className={`text-4xl font-black ${item.color}`}>{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 mb-10">
        <div className="card border-t-4 border-t-brand-500">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="p-1.5 bg-brand-50 rounded-lg text-brand-600">📊</span>
            Request Status Mix
          </h2>
          <div className="space-y-5">
            {requestStatus.map((item) => (
              <div key={item.status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink/70">
                  <span>{item.status}</span>
                  <span>{Math.round((item.count / Math.max(totalRequests, 1)) * 100)}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-brand-50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all duration-500"
                    style={{
                      width: `${(item.count / Math.max(totalRequests, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card border-t-4 border-t-orange-500">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="p-1.5 bg-orange-50 rounded-lg text-orange-600">📝</span>
              Pending Approvals
            </h2>
            <Link href="/dashboard/admin/donors" className="text-xs font-bold text-brand-600 hover:underline">
              View All Donors →
            </Link>
          </div>
          <div className="space-y-4">
            {pendingDonors.length ? (
              pendingDonors.map((donor) => (
                <div key={donor.id} className="rounded-xl border border-brand-100 p-4 bg-sand/30 hover:bg-white transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-brand-900">
                        {donor.user.name ?? "Anonymous"}
                      </h4>
                      <p className="text-xs text-ink/60 mt-0.5">
                        {bloodGroupLabels[donor.bloodGroup]} • {donor.location}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form action={async () => { "use server"; await setDonorApproval(donor.userId, true); }}>
                        <button type="submit" className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm" title="Approve">
                          ✔️
                        </button>
                      </form>
                      <form action={async () => { "use server"; await setDonorBlocked(donor.userId, true); }}>
                        <button type="submit" className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm" title="Block">
                          🚫
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-sm text-ink/50 font-medium">All caught up! No pending donors.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600">🔄</span>
            Recent Activity
          </h2>
          <Link href="/dashboard/admin/requests" className="text-xs font-bold text-brand-600 hover:underline">
            View All Requests →
          </Link>
        </div>
        <div className="grid gap-4">
          {recentRequests.length ? (
            recentRequests.map((request) => (
              <div key={request.id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 font-bold text-lg">
                      {bloodGroupLabels[request.bloodGroup].split(' ')[0]}
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">
                        {request.requester?.name ?? "Requester"} • {request.location}
                      </div>
                      <h4 className="text-lg font-bold text-brand-900">
                        {request.units} Units requested
                      </h4>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-auto">
                    <span className={`pill font-bold ${
                      request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      request.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
                      request.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {request.status}
                    </span>
                    
                    <div className="flex gap-2">
                      {request.status === "PENDING" ? (
                        <>
                          <form action={async () => { "use server"; await adminUpdateRequestStatus(request.id, "ACCEPTED"); }}> 
                            <button type="submit" className="btn btn-primary py-2 px-4 text-xs">
                              Approve
                            </button>
                          </form>
                          <form action={async () => { "use server"; await adminUpdateRequestStatus(request.id, "REJECTED"); }}> 
                            <button type="submit" className="btn btn-outline py-2 px-4 text-xs">
                              Reject
                            </button>
                          </form>
                        </>
                      ) : null}
                      {request.status === "ACCEPTED" ? (
                        <form action={async () => { "use server"; await adminUpdateRequestStatus(request.id, "COMPLETED"); }}> 
                          <button type="submit" className="btn btn-primary py-2 px-4 text-xs">
                            Complete
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12 text-ink/50">No recent requests found.</div>
          )}
        </div>
      </div>

      <div className="mb-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="p-1.5 bg-red-50 rounded-lg text-red-600">🚩</span>
            User Reports
          </h2>
          <Link href="/dashboard/admin/reports" className="text-xs font-bold text-brand-600 hover:underline">
            View All Reports →
          </Link>
        </div>
        <div className="grid gap-4">
          {reports.length ? (
            reports.map((report: import('@prisma/client').Report) => (
              <div key={report.id} className="card border-l-4 border-l-red-500">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">
                      {report.type} • {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <h4 className="text-lg font-bold text-red-900 mt-1">{report.reason}</h4>
                    <p className="text-xs text-ink/60">Target ID: {report.targetId}</p>
                    {report.reporterPhone && <p className="text-xs text-ink/60">Reporter: {report.reporterPhone}</p>}
                  </div>
                  <div className="flex gap-2">
                    <form action={async () => { "use server"; await dismissReport(report.id); }}>
                      <button type="submit" className="btn btn-outline py-2.5 px-6 text-xs font-bold">Dismiss</button>
                    </form>
                    {report.type === "DONOR" && (
                      <form action={async () => { "use server"; await setDonorBlocked(report.targetId, true); }}>
                        <button type="submit" className="btn btn-primary bg-red-600 border-red-600 hover:bg-red-700 py-2.5 px-6 text-xs font-bold shadow-lg shadow-red-600/20">Ban Donor</button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12 text-ink/50">No reports at the moment.</div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}









