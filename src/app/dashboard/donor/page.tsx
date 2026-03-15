import { markRequestCompleted, respondToRequest } from "@/app/actions/request";
import DashboardShell from "@/components/DashboardShell";
import AvailabilityToggle from "@/components/forms/AvailabilityToggle";
import DonorProfileForm from "@/components/forms/DonorProfileForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { bloodGroupLabels } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { Check, X, MapPin, Droplets, Info } from "lucide-react";

export default async function DonorDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  const userId = session.user.id as string;

  const [profile, requests] = await Promise.all([
    prisma.donorProfile.findUnique({
      where: { userId },
    }),
    prisma.bloodRequest.findMany({
      where: { donorId: userId },
      include: { requester: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <DashboardShell
      title="Donor Center"
      description="Manage your donation status and respond to life-saving requests."
    >
      <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <DonorProfileForm profile={profile} />
          
          <div className="card fade-up fade-up-delay-1 border-l-4 border-l-brand-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Droplets className="h-32 w-32" />
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-bold">
              Current Status
            </div>
            <h3 className="mt-2 text-3xl font-black text-brand-900">
              {profile?.availability ?? "AVAILABLE"}
            </h3>
            <div className="mt-6">
              {profile ? (
                <AvailabilityToggle
                  availability={
                    (profile.availability ?? "AVAILABLE") as
                      | "AVAILABLE"
                      | "UNAVAILABLE"
                  }
                  lastDonationDate={profile.lastDonationDate}
                />
              ) : (
                <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-900 text-sm">
                  <Info className="h-5 w-5 text-blue-500" />
                  <p>Complete your donor profile to set availability.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-xl font-bold text-brand-900">Incoming Requests</h3>
              <p className="text-xs text-ink/50 font-medium">Respond quickly to help those in need</p>
            </div>
            <div className="pill bg-brand-100 text-brand-700">{requests.length}</div>
          </div>

          <div className="space-y-4">
            {requests.length ? (
              requests.map((request, index) => (
                <div 
                  key={request.id} 
                  className={`card border-l-4 transition-all hover:shadow-glow-sm cursor-default fade-up ${
                    request.status === 'PENDING' ? 'border-l-amber-400 bg-amber-50/10' : 
                    request.status === 'ACCEPTED' ? 'border-l-green-400 bg-green-50/10' : 
                    'border-l-brand-100'
                  }`}
                  style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-bold">
                        {request.requester.name ?? "Requester"}
                      </div>
                      <h4 className="mt-1 text-xl font-black text-brand-900">
                        {bloodGroupLabels[request.bloodGroup]}
                      </h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      request.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      request.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                      request.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-xs text-ink/70 font-medium">
                      <Droplets className="h-3.5 w-3.5 text-brand-500" />
                      {request.units} Units
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ink/70 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-brand-500" />
                      <span className="truncate">{request.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-brand-50 pt-4">
                    {request.status === "PENDING" ? (
                      <>
                        <form action={async () => { "use server"; await respondToRequest(request.id, "ACCEPTED"); }} className="flex-1">
                          <button type="submit" className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold text-xs shadow-sm hover:shadow-md active:scale-95" title="Accept Request">
                            <Check className="h-3.5 w-3.5" />
                            Accept
                          </button>
                        </form>
                        <form action={async () => { "use server"; await respondToRequest(request.id, "REJECTED"); }} className="flex-1">
                          <button type="submit" className="w-full flex items-center justify-center gap-2 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all font-bold text-xs active:scale-95" title="Reject Request">
                            <X className="h-3.5 w-3.5" />
                            Decline
                          </button>
                        </form>
                      </>
                    ) : null}
                    {request.status === "ACCEPTED" ? (
                      <form action={async () => { "use server"; await markRequestCompleted(request.id); }} className="w-full">
                        <button type="submit" className="w-full btn btn-primary py-2.5 text-xs font-bold">
                          <Check className="h-4 w-4" />
                          Mark Completed
                        </button>
                      </form>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="card text-center py-12 border-dashed border-2 flex flex-col items-center justify-center text-ink/40 fade-up fade-up-delay-2">
                <Droplets className="h-12 w-12 mb-4 opacity-20" />
                <p className="font-bold">No incoming requests</p>
                <p className="text-xs mt-1">We&apos;ll notify you when someone needs your help.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
