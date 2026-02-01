"use client";

import { getDonorsAction } from "@/app/actions/donors";
import DonorCard from "@/components/DonorCard";
import SectionHeading from "@/components/SectionHeading";
import { useCachedData } from "@/hooks/useCachedData";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import SearchFilters from "@/components/donors/SearchFilters";

export default function DonorsClientView() {
  const searchParams = useSearchParams();
  
  // Construct a stable cache key based on params
  const paramsKey = searchParams.toString();
  const cacheKey = `donors_list_${paramsKey || "default"}`;

  // Memoize fetcher so it doesn't trigger effect loop
  const fetcher = useCallback(async () => {
    const params = {
      bloodGroup: searchParams.get("bloodGroup") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      availability: searchParams.get("availability") ?? undefined, // Ensure API handles string vs enum mapping if needed
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1
    };
    // Note: getDonorsAction returns { donors, total }
    return getDonorsAction(params);
  }, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, isServingCache, isValidating } = useCachedData(cacheKey, fetcher);

  const donors = data?.donors ?? [];
  const totalDonors = data?.total ?? 0;
  const PAGE_SIZE = 12;
  const totalPages = Math.ceil(totalDonors / PAGE_SIZE);
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;

  return (
    <section className="container-pad py-16">
      <div className="flex justify-between items-start">
        <SectionHeading
          eyebrow="Find donors"
          title="Search verified donors."
          subtitle="Instant results from secure cache."
        />
        <div className="text-right text-xs text-ink/40 mt-4">
           {isServingCache && <span className="text-emerald-600 font-medium">⚡ Instant (Cached)</span>}
           {isValidating && <span className="ml-2 animate-pulse text-brand-500">Updating...</span>}
        </div>
      </div>
      
      {/* Search Filters (Client Component) */}
      <SearchFilters initialParams={{}} /> 

      {/* Results */}
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
                href={`?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: (page - 1).toString() }).toString()}`}
                className={`btn btn-outline ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
              >
                Previous
              </Link>
              <span className="text-sm font-semibold">Page {page} of {totalPages}</span>
              <Link
                href={`?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: (page + 1).toString() }).toString()}`}
                className={`btn btn-outline ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
              >
                Next
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="card flex flex-col items-center justify-center py-12 text-center">
             {!data ? (
                // First load skeleton (only if no cache)
                 <div className="animate-pulse">Loading first time...</div>
             ) : (
                <>
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="text-xl font-semibold">No donors found</h3>
                </>
             )}
        </div>
      )}
    </section>
  );
}
