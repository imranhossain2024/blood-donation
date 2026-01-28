import DonorCard from "@/components/DonorCard";
import SectionHeading from "@/components/SectionHeading";
import { prisma } from "@/lib/prisma";
import { bloodGroups } from "@/lib/validators";
import { bloodGroupLabels } from "@/lib/utils";
import Link from "next/link";

export default async function DonorsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {

  const bloodGroup = typeof searchParams.bloodGroup === "string" ? searchParams.bloodGroup : "";
  const location = typeof searchParams.location === "string" ? searchParams.location : "";
  const availability = typeof searchParams.availability === "string" ? searchParams.availability : "";
  const keyword = typeof searchParams.keyword === "string" ? searchParams.keyword : "";

  const donors = await prisma.donorProfile.findMany({
    where: {
      approved: true,
      blocked: false,
      ...(bloodGroup ? { bloodGroup } : {}),
      ...(availability ? { availability } : {}),
      ...(location
        ? {
            location: {
              contains: location,
              mode: "insensitive",
            },
          }
        : {}),
      ...(keyword
        ? {
            OR: [
              { location: { contains: keyword, mode: "insensitive" } },
              { user: { name: { contains: keyword, mode: "insensitive" } } },
              { user: { email: { contains: keyword, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Get total stats
  const totalDonors = await prisma.donorProfile.count({
    where: { approved: true, blocked: false },
  });

  const availableDonors = await prisma.donorProfile.count({
    where: { approved: true, blocked: false, availability: "AVAILABLE" },
  });

  const clearFilters = !bloodGroup && !location && !availability;

  return (
    <section className="container-pad py-16">
      <SectionHeading
        eyebrow="Find donors"
        title="Search verified donors by blood group and area."
        subtitle="Only approved donors appear in this list."
      />

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Total donors</p>
          <p className="mt-2 text-3xl font-semibold text-brand-600">{totalDonors}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Available now</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">{availableDonors}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Search results</p>
          <p className="mt-2 text-3xl font-semibold text-blue-600">{donors.length}</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Filter donors</h2>
          <p className="mt-1 text-sm text-ink/70">Use filters to find the right donor for your needs.</p>
        </div>

        <form className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Keyword
            </label>
            <input
              name="keyword"
              type="text"
              defaultValue={keyword}
              placeholder="Name, email, or location"
              className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Blood group
            </label>
            <select
              name="bloodGroup"
              defaultValue={bloodGroup}
              className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
            >
              <option value="">All blood groups</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {bloodGroupLabels[group]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Location
            </label>
            <input
              name="location"
              type="text"
              defaultValue={location}
              placeholder="e.g. Gulshan, Dhanmondi"
              className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Availability
            </label>
            <select
              name="availability"
              defaultValue={availability}
              className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
            >
              <option value="">Any status</option>
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Not available</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            {!clearFilters && (
              <Link
                href="/donors"
                className="btn btn-outline"
              >
                Clear
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Active Filters Display */}
      {!clearFilters && (
        <div className="mb-6 rounded-2xl border border-brand-100 bg-brand-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink/70">Active filters:</span>
            {bloodGroup && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">
                Blood: {bloodGroupLabels[bloodGroup]}
                <button
                  formAction={async () => {
                    'use server';
                  }}
                  className="text-ink/60 hover:text-ink"
                >
                  ×
                </button>
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">
                Location: {location}
              </span>
            )}
            {availability && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">
                Status: {availability === "AVAILABLE" ? "Available" : "Not available"}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Results Section */}
      <div>
        {donors.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Found {donors.length} donor{donors.length !== 1 ? "s" : ""}
              </h3>
              <span className="text-xs uppercase tracking-[0.3em] text-ink/60">
                Showing results
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {donors.map((donor) => (
                <DonorCard key={donor.id} donor={donor} />
              ))}
            </div>
          </>
        ) : (
          <div className="card flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-semibold">No donors found</h3>
            <p className="mt-2 text-sm text-ink/70">
              {clearFilters
                ? "There are no available donors at the moment."
                : "Try adjusting your filters to find more donors."}
            </p>
            {!clearFilters && (
              <Link href="/donors" className="btn btn-primary mt-4">
                Clear filters and try again
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

