import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import { cancelRequest } from "@/app/actions/request";
import { bloodGroupLabels } from "@/lib/utils";

import Link from "next/link";

const PAGE_SIZE = 10;

export default async function RequestsPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  const page = searchParams && typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const skip = (page - 1) * PAGE_SIZE;

  const [requests, total] = await Promise.all([
    prisma.bloodRequest.findMany({
      where: { requesterId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.bloodRequest.count({ where: { requesterId: session.user.id } }),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <DashboardShell title="Requests" description="Track your blood requests.">
      <div className="grid gap-4">
        {requests.length ? (
          <>
            {requests.map((request) => (
              <div key={request.id} className="card">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                    <h3 className="mt-2 text-xl font-semibold">
                      {bloodGroupLabels[request.bloodGroup]} - {request.units} units
                    </h3>
                    <p className="mt-1 text-sm text-ink/70">{request.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="pill">{request.status}</span>
                    {request.status === "PENDING" ? (
                      <>
                        <Link
                          href={`/dashboard/requests/${request.id}/matches`}
                          className="btn btn-primary"
                        >
                          Find Matches
                        </Link>
                        <form action={async (_formData: FormData) => {
                          "use server";
                          await cancelRequest(request.id);
                          return;
                        }}>
                          <button type="submit" className="btn btn-outline">
                            Cancel
                          </button>
                        </form>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <Link
                  href={`?page=${page - 1}`}
                  className={`btn btn-outline ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                  aria-disabled={page <= 1}
                >
                  Previous
                </Link>
                <span className="text-sm font-semibold">Page {page} of {totalPages}</span>
                <Link
                  href={`?page=${page + 1}`}
                  className={`btn btn-outline ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                  aria-disabled={page >= totalPages}
                >
                  Next
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="card">No requests yet.</div>
        )}
      </div>
    </DashboardShell>
  );
}

