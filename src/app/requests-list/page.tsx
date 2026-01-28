import { prisma } from "@/lib/prisma";
import SectionHeading from "@/components/SectionHeading";
import { bloodGroupLabels } from "@/lib/utils";

export default async function BloodRequestsPage() {
  const requests = await prisma.bloodRequest.findMany({
    include: {
      user: { select: { name: true, email: true } },
      donor: { select: { name: true, bloodGroup: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="container-pad py-16">
      <SectionHeading
        eyebrow="Blood Requests"
        title="All Blood Requests"
        subtitle="Browse all blood requests submitted by users."
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {requests.length === 0 ? (
          <div className="card col-span-full text-center py-12">
            <div className="text-4xl mb-3">🩸</div>
            <h3 className="text-xl font-semibold">No blood requests found</h3>
            <p className="mt-2 text-sm text-ink/70">No one has requested blood yet.</p>
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
                {req.units} unit{req.units > 1 ? "s" : ""} needed
              </div>
              <div className="text-sm text-ink/70 mb-1">
                Needed by: <span className="font-semibold text-ink">{new Date(req.neededAt).toLocaleDateString()}</span>
              </div>
              <div className="text-sm text-ink/70 mb-1">
                Location: <span className="font-semibold text-ink">{req.location}</span>
              </div>
              {req.note && (
                <div className="text-xs text-ink/60 italic mb-1">Note: {req.note}</div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-ink/60">Requested by:</span>
                <span className="font-semibold text-ink">{req.user?.name || "Unknown"}</span>
                <span className="text-xs text-ink/40">({req.user?.email})</span>
              </div>
              {req.donor && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-ink/60">Preferred donor:</span>
                  <span className="font-semibold text-brand-600">{req.donor.name || "Donor"}</span>
                  <span className="pill bg-brand-100 text-brand-700 text-xs">{bloodGroupLabels[req.donor.bloodGroup]}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
