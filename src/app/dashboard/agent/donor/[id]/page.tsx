import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import { agentApproveDonor } from "@/app/actions/agent";
import { bloodGroupLabels } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft, CheckCircle, Clock } from "lucide-react";

interface Props {
  params: { id: string };
}

export default async function AgentDonorDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "AGENT") {
    return (
      <DashboardShell title="Unauthorized" description="Access denied.">
        <div className="card text-error">You do not have permission to view this page.</div>
      </DashboardShell>
    );
  }

  const donor = await prisma.donorProfile.findUnique({
    where: { 
      id: params.id,
      OR: [
        { area: session.user.agentArea },
        { agentId: session.user.id }
      ]
    },
    include: { user: true },
  });

  if (!donor) return notFound();

  return (
    <DashboardShell 
      title="Donor Details" 
      description={`Reviewing ${donor.user?.name || "Anonymous donor"}`}
    >
      <div className="mb-6">
        <Link 
          href="/dashboard/agent" 
          className="text-sm font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 w-fit"
        >
          <ChevronLeft className="h-4 w-4" /> Back to List
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="card p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-black text-brand-900 mb-2">
                  {donor.user?.name || "Anonymous Donor"}
                </h1>
                <div className="flex gap-3">
                  <span className={`pill font-bold ${donor.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} flex items-center gap-1.5`}>
                    {donor.approved ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    {donor.approved ? "Approved" : "Pending Verification"}
                  </span>
                  <span className="pill bg-brand-50 text-brand-700 font-bold uppercase tracking-wider text-xs">
                    {donor.location}
                  </span>
                </div>
              </div>
              <div className="text-center bg-brand-500 text-white p-4 rounded-3xl shadow-lg border-4 border-white min-w-[100px]">
                <div className="text-[10px] uppercase font-bold tracking-widest opacity-80">Group</div>
                <div className="text-3xl font-black leading-tight">{bloodGroupLabels[donor.bloodGroup]}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-brand-50 pt-8">
              <div>
                <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-ink/40 mb-3">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-ink/50 block">Email Address</label>
                    <div className="font-semibold text-brand-900">{donor.user?.email || "No email provided"}</div>
                  </div>
                  <div>
                    <label className="text-xs text-ink/50 block">Phone Number</label>
                    <div className="font-semibold text-brand-900">{donor.user?.id || donor.user?.email ? "Available for approved agents" : "Not available"}</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-ink/40 mb-3">Donation History</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-ink/50 block">Last Donation</label>
                    <div className="font-semibold text-brand-900">
                      {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : "No record available"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-ink/50 block">Account Status</label>
                    <div className={`font-semibold ${donor.blocked ? "text-red-500" : "text-green-600"}`}>
                      {donor.blocked ? "Account Blocked" : "Active & Verified"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {!donor.approved && (
            <div className="card border-t-4 border-t-green-500 bg-green-50/20">
              <h3 className="text-xl font-bold text-brand-900 mb-3">Verification</h3>
              <p className="text-sm text-ink/60 mb-6 leading-relaxed">
                Confirm that this donor has provided valid information and is eligible to join the network.
              </p>
              <form action={agentApproveDonor.bind(null, donor.id)}>
                <button type="submit" className="btn btn-primary w-full py-4 text-sm font-bold shadow-xl">
                  Approve Donor Account
                </button>
              </form>
            </div>
          )}
          
          <div className="card bg-sand/20">
            <h3 className="text-sm font-bold text-ink/70 mb-4 uppercase tracking-widest">Administrative Info</h3>
            <div className="text-xs space-y-3">
              <div className="flex justify-between border-b border-white/50 pb-2">
                <span className="text-ink/40">Profile ID</span>
                <span className="font-mono text-[10px]">{donor.id}</span>
              </div>
              <div className="flex justify-between border-b border-white/50 pb-2">
                <span className="text-ink/40">Created</span>
                <span>{new Date(donor.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-white/50 pb-2">
                <span className="text-ink/40">Assigned Agent</span>
                <span>{session.user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
