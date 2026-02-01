
import { prisma } from "@/lib/prisma";
import { bloodGroupLabels } from "@/lib/utils";
import Link from "next/link";
import { unstable_cache } from "next/cache";

type Props = {
  agentArea: string | null;
  agentId: string;
};

// Cache for 30s as agent view might need to be relatively fresh but not instant
const getAgentDonors = unstable_cache(
  async (area: string | null, id: string) => {
    return prisma.donorProfile.findMany({
      where: { 
        OR: [
          { area: area },
          { agentId: id }
        ]
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  },
  ["agent-donors"],
  { revalidate: 30, tags: ["donors"] }
);

export default async function AgentDonorList({ agentArea, agentId }: Props) {
  const donors = await getAgentDonors(agentArea, agentId);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Donors in Your Area</h2>
        <span className="pill bg-brand-100 text-brand-800">{donors.length} total</span>
      </div>

      {donors.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-lg font-semibold">No donors found</h3>
          <p className="text-sm text-ink/60">There are no donors currently registered in your area.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {donors.map((donor) => (
            <div key={donor.id} className="card group hover:border-brand-300 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-brand-900 group-hover:text-brand-700 transition-colors">
                    {donor.user?.name || "Anonymous Donor"}
                  </h3>
                  <p className="text-xs text-ink/50 uppercase tracking-widest">{donor.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand-600">{bloodGroupLabels[donor.bloodGroup] ?? donor.bloodGroup}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-50">
                <span className={`pill ${donor.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {donor.approved ? "Approved" : "Pending Approval"}
                </span>
                <Link 
                  href={`/dashboard/agent/donor/${donor.id}`} 
                  className="text-sm font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                >
                  Manage Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
