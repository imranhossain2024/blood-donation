

import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import SectionHeading from "@/components/SectionHeading";
import { bloodGroupLabels } from "@/lib/utils";
import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionary";

const PAGE_SIZE = 10;

export default async function BloodRequestsPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const page = searchParams && typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const skip = (page - 1) * PAGE_SIZE;

  const [requests, total] = await Promise.all([
    prisma.bloodRequest.findMany({
      include: {
        requester: { select: { name: true, email: true } },
        donor: { select: { name: true, donorProfile: { select: { bloodGroup: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.bloodRequest.count(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
  const dict = await getDictionary(locale);

  return (
    <section className="container-pad py-16">
      <SectionHeading
        eyebrow={dict.requestsListPage.eyebrow}
        title={dict.requestsListPage.title}
        subtitle={dict.requestsListPage.subtitle}
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {requests.length === 0 ? (
          <div className="card col-span-full text-center py-12">
            <div className="text-4xl mb-3">🩸</div>
            <h3 className="text-xl font-semibold">{dict.requestsListPage.noRequestsTitle}</h3>
            <p className="mt-2 text-sm text-ink/70">{dict.requestsListPage.noRequestsDesc}</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="card flex flex-col gap-2 p-6 shadow-lg border border-brand-100 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-2">
                <span className="pill bg-brand-600 text-white text-xs font-bold">
                  {bloodGroupLabels[req.bloodGroup]}
                </span>
                <span className={`pill text-xs font-bold ${req.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : req.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" : req.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                  {req.status}
                </span>
              </div>
              <div className="text-lg font-semibold text-brand-700 mb-1">
                {req.units} {req.units > 1 ? dict.requestsListPage.unitsNeeded : dict.requestsListPage.unitNeeded}
              </div>
              <div className="text-sm text-ink/70 mb-1">
                {dict.requestsListPage.neededBy} <span className="font-semibold text-ink">{new Date(req.neededAt).toLocaleDateString()}</span>
              </div>
              <div className="text-sm text-ink/70 mb-1">
                {dict.requestsListPage.location} <span className="font-semibold text-ink">{req.location}</span>
              </div>
              {req.note && (
                <div className="text-xs text-ink/60 italic mb-1">{dict.requestsListPage.note} {req.note}</div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-ink/60">{dict.requestsListPage.requestedBy}</span>
                <span className="font-semibold text-ink">{req.requester?.name || dict.requestsListPage.unknown}</span>
                <span className="text-xs text-ink/40">({req.requester?.email})</span>
              </div>
              {req.donor && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-ink/60">{dict.requestsListPage.preferredDonor}</span>
                  <span className="font-semibold text-brand-600">{req.donor.name || "Donor"}</span>
                  {req.donor.donorProfile?.bloodGroup && (
                    <span className="pill bg-brand-100 text-brand-700 text-xs">{bloodGroupLabels[req.donor.donorProfile.bloodGroup]}</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-10">
          <Link
            href={`?page=${page - 1}`}
            className={`btn btn-outline ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
            aria-disabled={page <= 1}
          >
            {dict.requestsListPage.prev}
          </Link>
          <span className="text-sm font-semibold">{dict.requestsListPage.page} {page} {dict.requestsListPage.of} {totalPages}</span>
          <Link
            href={`?page=${page + 1}`}
            className={`btn btn-outline ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
            aria-disabled={page >= totalPages}
          >
            {dict.requestsListPage.next}
          </Link>
        </div>
      )}
    </section>
  );
}
