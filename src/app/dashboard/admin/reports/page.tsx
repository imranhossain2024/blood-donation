import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import { dismissReport } from "@/app/actions/report";
import { setDonorBlocked } from "@/app/actions/admin";
import Link from "next/link";

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell
      title="User Reports"
      description="Review and act on reports submitted by users."
    >
      <div className="mb-8 flex justify-end">
        <Link href="/dashboard/admin" className="btn btn-outline text-xs">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-6">
        {reports.length ? (
          reports.map((report) => (
            <div key={report.id} className="card border-l-4 border-l-red-500 hover:shadow-lg transition-all group">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="pill bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
                      {report.type} Report
                    </span>
                    <span className="text-[10px] text-ink/40 font-bold">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-ink group-hover:text-red-600 transition-colors">
                    {report.reason}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/60">
                    <p>Target ID: <code className="bg-brand-50 px-1 rounded">{report.targetId}</code></p>
                    {report.reporterPhone && <p>Reporter: <strong>{report.reporterPhone}</strong></p>}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <form action={async () => { "use server"; await dismissReport(report.id); }}>
                    <button type="submit" className="btn btn-outline py-2.5 px-6 text-xs font-bold">
                      Dismiss
                    </button>
                  </form>
                  {report.type === "DONOR" && (
                    <form action={async () => { "use server"; await setDonorBlocked(report.targetId, true); }}>
                      <button type="submit" className="btn btn-primary bg-red-600 border-red-600 hover:bg-red-700 py-2.5 px-6 text-xs font-bold shadow-lg shadow-red-600/20">
                        Ban Donor
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-20 bg-brand-50/20 border-brand-100">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-lg font-bold text-ink">Excellent! No reports found.</h3>
            <p className="text-sm text-ink/50 mt-1">The community is doing great.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
