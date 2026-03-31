import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import { cancelRequest } from "@/app/actions/request";
import { bloodGroupLabels } from "@/lib/utils";

import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionary";

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

  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
  const dict = await getDictionary(locale);

  return (
    <DashboardShell title={dict.requestsPage.title} description={dict.requestsPage.desc} dict={dict}>
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
                    <h3 className="mt-2 text-lg md:text-xl font-semibold">
                      {bloodGroupLabels[request.bloodGroup]} - {request.units} {dict.requestsPage.units}
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
                          {dict.requestsPage.findMatches}
                        </Link>
                        <form action={async () => {
                          "use server";
                          await cancelRequest(request.id);
                          return;
                        }}>
                          <button type="submit" className="btn btn-outline">
                            {dict.requestsPage.cancel}
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
                  {dict.requestsPage.prev}
                </Link>
                <span className="text-sm font-semibold">{dict.requestsPage.page} {page} {dict.requestsPage.of} {totalPages}</span>
                <Link
                  href={`?page=${page + 1}`}
                  className={`btn btn-outline ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                  aria-disabled={page >= totalPages}
                >
                  {dict.requestsPage.next}
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="card">{dict.requestsPage.noRequests}</div>
        )}
      </div>
    </DashboardShell>
  );
}

