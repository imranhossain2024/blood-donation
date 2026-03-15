import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import DashboardShell from "@/components/DashboardShell";
import { bloodGroupLabels } from "@/lib/utils";
import Link from "next/link";
import { RequestStatus } from "@prisma/client";
import RequestActions from "./RequestActions";

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const status = typeof searchParams.status === "string" ? searchParams.status as RequestStatus : undefined;
  
  const requests = await prisma.bloodRequest.findMany({
    where: {
      ...(status ? { status } : {}),
    },
    include: { requester: true, donor: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses: RequestStatus[] = ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"];

  return (
    <DashboardShell
      title="Manage Requests"
      description="View and manage all blood donation requests."
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/dashboard/admin/requests" 
            className={`pill text-xs font-bold ${!status ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-600 hover:bg-brand-100"}`}
          >
            All
          </Link>
          {statuses.map((s) => (
            <Link 
              key={s}
              href={`?status=${s}`} 
              className={`pill text-xs font-bold ${status === s ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-600 hover:bg-brand-100"}`}
            >
              {s}
            </Link>
          ))}
        </div>
        <Link href="/dashboard/admin" className="btn btn-outline text-xs">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50/50 text-xs font-bold uppercase tracking-wider text-ink/50 border-b border-brand-100">
              <tr>
                <th className="px-6 py-4">Requester</th>
                <th className="px-6 py-4">Group</th>
                <th className="px-6 py-4">Units</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-brand-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-ink">{request.requester.name || "Anonymous"}</div>
                      <div className="text-xs text-ink/50">{request.location}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="font-medium text-brand-600">
                        {bloodGroupLabels[request.bloodGroup].split(' ')[0]}
                       </span>
                    </td>
                    <td className="px-6 py-4 font-bold">{request.units}</td>
                    <td className="px-6 py-4">
                      <span className={`pill text-[10px] font-bold ${
                        request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        request.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
                        request.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                        request.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <RequestActions requestId={request.id} status={request.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-ink/50">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
