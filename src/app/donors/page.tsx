
import DonorList from "@/components/donors/DonorList";
export const dynamic = 'force-dynamic';
import DonorStats from "@/components/donors/DonorStats";
import SearchFilters from "@/components/donors/SearchFilters";
import { SkeletonGrid, SkeletonStats } from "@/components/donors/Skeletons";
import SectionHeading from "@/components/SectionHeading";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionary";

export default async function DonorsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
  const dict = await getDictionary(locale);
  return (
    <section className="container-pad py-16">
      <SectionHeading
        eyebrow={dict.donorsPage.eyebrow}
        title={dict.donorsPage.title}
        subtitle={dict.donorsPage.subtitle}
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
