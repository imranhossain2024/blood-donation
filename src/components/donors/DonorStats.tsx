
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Cache stats for 60 seconds to avoid DB hammering
const getDonorStats = unstable_cache(
  async () => {
    const [totalDonors, availableDonors, recentDonors] = await Promise.all([
      prisma.donorProfile.count({ where: { approved: true, blocked: false } }),
      prisma.donorProfile.count({ where: { approved: true, blocked: false, availability: "AVAILABLE" } }),
      prisma.donorProfile.count({ where: { approved: true, blocked: false, updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    ]);
    return { totalDonors, availableDonors, recentDonors };
  },
  ["donor-stats"],
  { revalidate: 60, tags: ["donors"] }
);

export default async function DonorStats() {
  const { totalDonors, availableDonors, recentDonors } = await getDonorStats();

  return (
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
        <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Recent active</p>
        <p className="mt-2 text-3xl font-semibold text-blue-600">{recentDonors}</p>
      </div>
    </div>
  );
}
