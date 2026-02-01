
import SectionHeading from "@/components/SectionHeading";
import { Suspense } from "react";
import DonorStats from "@/components/donors/DonorStats";
import DonorList from "@/components/donors/DonorList";
import SearchFilters from "@/components/donors/SearchFilters";
import { SkeletonGrid, SkeletonStats } from "@/components/donors/Skeletons";

export default function DonorsPage({
  searchParams,
}: {
  searchParams: any;
}) {
  return (
    <section className="container-pad py-16">
      <SectionHeading
        eyebrow="Find donors"
        title="Search verified donors by blood group and area."
        subtitle="Only approved donors appear in this list."
      />

      {/* 1. Stats Load Independently */}
      <Suspense fallback={<SkeletonStats />}>
        <DonorStats />
      </Suspense>

      {/* 2. Filters Load Immediately (Client Comp) */}
      <SearchFilters initialParams={searchParams} />

      {/* 3. Main Data Loads with Stream */}
      <Suspense fallback={<SkeletonGrid />}>
        <DonorList searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
