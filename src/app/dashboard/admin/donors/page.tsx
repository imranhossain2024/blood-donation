import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import DashboardShell from "@/components/DashboardShell";
import { setDonorApproval, setDonorBlocked } from "@/app/actions/admin";
import { bloodGroupLabels } from "@/lib/utils";
import Link from "next/link";

export default async function AdminDonorsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = typeof searchParams.query === "string" ? searchParams.query : "";
  
  const donors = await prisma.donorProfile.findMany({
    where: {
      OR: [
        { user: { name: { contains: query, mode: "insensitive" } } },
        { user: { email: { contains: query, mode: "insensitive" } } },
        { location: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell
      title="Manage Donors"
      description="View and manage all registered donors."
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <form className="flex-1 max-w-md">
          <input
            name="query"
            defaultValue={query}
            placeholder="Search donors by name, email, or location..."
            className="w-full rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 outline-none"
          />
        </form>
        <Link href="/dashboard/admin" className="btn btn-outline text-xs">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50/50 text-xs font-bold uppercase tracking-wider text-ink/50 border-b border-brand-100">
              <tr>
                <th className="px-6 py-4">Donor</th>
                <th className="px-6 py-4">Group</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {donors.length > 0 ? (
                donors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-brand-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-ink">{donor.user.name || "Anonymous"}</div>
                      <div className="text-xs text-ink/50">{donor.user.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{bloodGroupLabels[donor.bloodGroup]}</td>
                    <td className="px-6 py-4 text-ink/70">{donor.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`pill text-[10px] w-fit font-bold ${donor.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {donor.approved ? "Approved" : "Pending"}
                        </span>
                        {donor.blocked && (
                          <span className="pill text-[10px] w-fit font-bold bg-red-100 text-red-700">
                            Blocked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {!donor.approved && !donor.blocked && (
                          <form action={async () => { "use server"; await setDonorApproval(donor.userId, true); }}>
                            <button title="Approve" className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100">
                              ✔️
                            </button>
                          </form>
                        )}
                        <form action={async () => { "use server"; await setDonorBlocked(donor.userId, !donor.blocked); }}>
                          <button 
                            title={donor.blocked ? "Unblock" : "Block"} 
                            className={`p-2 rounded-lg ${donor.blocked ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                          >
                            {donor.blocked ? "🔓" : "🚫"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-ink/50">
                    No donors found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
