
import DonorCard from "@/components/DonorCard";
import { prisma } from "@/lib/prisma";
import { AvailabilityStatus, BloodGroup, Prisma } from "@prisma/client";
import Link from "next/link";

const PAGE_SIZE = 12;

export default async function DonorList({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const bloodGroup = typeof searchParams.bloodGroup === "string" ? searchParams.bloodGroup : "";
  const location = typeof searchParams.location === "string" ? searchParams.location : "";
  const availability = typeof searchParams.availability === "string" ? searchParams.availability : "";
  const lastDonation = typeof searchParams.lastDonation === "string" ? searchParams.lastDonation : "";
  const keyword = typeof searchParams.keyword === "string" ? searchParams.keyword : "";
  const skip = (page - 1) * PAGE_SIZE;

  const donationDateLimit = lastDonation ? new Date(Date.now() - parseInt(lastDonation) * 24 * 60 * 60 * 1000) : null;

  const whereClause: Prisma.DonorProfileWhereInput = {
    approved: true,
    blocked: false,
    ...(bloodGroup ? { bloodGroup: bloodGroup as BloodGroup } : {}),
    ...(availability ? { availability: availability as AvailabilityStatus } : {}),
    ...(donationDateLimit ? { lastDonationDate: { gte: donationDateLimit } } : {}),
    ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
    ...(keyword
      ? {
        OR: [
          { location: { contains: keyword, mode: "insensitive" } },
          { user: { name: { contains: keyword, mode: "insensitive" } } },
          { user: { email: { contains: keyword, mode: "insensitive" } } },
        ] as Prisma.DonorProfileWhereInput["OR"],
      }
      : {}),
  };

  const [donors, totalDonors] = await Promise.all([
    prisma.donorProfile.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.donorProfile.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalDonors / PAGE_SIZE);
  const clearFilters = !bloodGroup && !location && !availability && !keyword;

  return (
    <div>
      {/* Active Filters Display */}
      {!clearFilters && (
        <div className="mb-6 rounded-2xl border border-brand-100 bg-brand-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink/70">Found {totalDonors} matches</span>
            {/* Detailed filter tags can be added here similar to original */}
          </div>
        </div>
      )}

      {donors.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {donors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-10">
              <Link
                href={`?${new URLSearchParams({ ...searchParams, page: (page - 1).toString() }).toString()}`}
                className={`btn btn-outline ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                aria-disabled={page <= 1}
              >
                Previous
              </Link>
              <span className="text-sm font-semibold">Page {page} of {totalPages}</span>
              <Link
                href={`?${new URLSearchParams({ ...searchParams, page: (page + 1).toString() }).toString()}`}
                className={`btn btn-outline ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                aria-disabled={page >= totalPages}
              >
                Next
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="card flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-xl font-semibold">No donors found</h3>
          <p className="mt-2 text-sm text-ink/70">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
