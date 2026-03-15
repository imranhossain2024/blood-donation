import BloodRequestForm from "@/components/forms/BloodRequestForm";
import SectionHeading from "@/components/SectionHeading";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';

export default async function RequestPage() {
  const donors = await prisma.donorProfile.findMany({
    where: { approved: true, blocked: false, availability: "AVAILABLE" },
    include: { user: true },
    orderBy: { updatedAt: "desc" },
  });

  const donorOptions = donors.map((donor) => ({
    id: donor.userId,
    name: donor.user.name,
    bloodGroup: donor.bloodGroup,
    location: donor.location,
  }));

  return (
    <section className="container-pad py-16">
      <SectionHeading
        eyebrow="Request blood"
        title="Send a verified blood request."
        subtitle="Requests are tracked in real-time and shared with available donors."
      />
      <BloodRequestForm donors={donorOptions} />
    </section>
  );
}
