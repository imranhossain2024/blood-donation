import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import DonorCard from "@/components/DonorCard";
import { notFound } from "next/navigation";
import { bloodGroupLabels } from "@/lib/utils";

export default async function MatchedDonorsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const request = await prisma.bloodRequest.findUnique({
    where: { id: params.id },
  });

  if (!request || request.requesterId !== session.user.id) {
    return notFound();
  }

  // Find donors matching blood group and potentially location
  const matchedDonors = await prisma.donorProfile.findMany({
    where: {
      bloodGroup: request.bloodGroup,
      approved: true,
      blocked: false,
      availability: "AVAILABLE",
      // Optional: match by location keywords
      location: {
        contains: request.location.split(",")[0],
        mode: "insensitive",
      },
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    take: 10,
  });

  return (
    <DashboardShell
      title="Matched Donors"
      description={`Potential donors for your ${bloodGroupLabels[request.bloodGroup]} request.`}
    >
      <div className="space-y-8">
        <div className="card border-brand-200 bg-brand-50/50">
          <h3 className="font-semibold text-brand-800">Request Details</h3>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-ink/40 uppercase text-[10px] tracking-wider">Blood Group</span>
              <p className="font-bold text-lg">{bloodGroupLabels[request.bloodGroup]}</p>
            </div>
            <div>
              <span className="text-ink/40 uppercase text-[10px] tracking-wider">Location</span>
              <p className="font-medium">{request.location}</p>
            </div>
          </div>
        </div>

        {matchedDonors.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matchedDonors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        ) : (
          <div className="card py-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold">No direct matches found</h3>
            <p className="mt-2 text-ink/60">Try searching the full donor directory with broader filters.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
