import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import DonorProfileForm from "@/components/forms/DonorProfileForm";
import AvailabilityToggle from "@/components/forms/AvailabilityToggle";
import { respondToRequest, markRequestCompleted } from "@/app/actions/request";
import { bloodGroupLabels } from "@/lib/utils";

export default async function DonorDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const [profile, requests] = await Promise.all([
    prisma.donorProfile.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.bloodRequest.findMany({
      where: { donorId: session.user.id },
      include: { requester: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <DashboardShell
      title="Donor Center"
      description="Update your availability and respond to requests."
    >
      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <DonorProfileForm profile={profile} />
          <div className="card">
            <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Current Status
            </div>
            <h3 className="mt-2 text-2xl font-semibold">
              {profile?.availability ?? "AVAILABLE"}
            </h3>
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
              <p className="mt-3 text-sm text-ink/70">
                Complete your donor profile to set availability.
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-2xl font-semibold">Incoming requests</h3>
            <p className="mt-2 text-sm text-ink/70">
              Respond quickly to keep the network active.
            </p>
          </div>
          {requests.length ? (
            requests.map((request) => (
              <div key={request.id} className="card space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
                    {request.requester.name ?? "Requester"}
                  </div>
                  <h4 className="mt-2 text-xl font-semibold">
                    {bloodGroupLabels[request.bloodGroup]} - {request.units}{" "}
                    units
                  </h4>
                  <p className="text-sm text-ink/70">{request.location}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {request.status === "PENDING" ? (
                    <>
                      <form action={async () => { "use server"; await respondToRequest(request.id, "ACCEPTED"); return; }}>
                        <button type="submit" className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm" title="Accept">
                          ✔️
                        </button>
                      </form>
                      <form action={async () => { "use server"; await respondToRequest(request.id, "REJECTED"); return; }}>
                        <button type="submit" className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm" title="Reject">
                          🚫
                        </button>
                      </form>
                    </>
                  ) : null}
                  {request.status === "ACCEPTED" ? (
                    <form action={async () => { "use server"; await markRequestCompleted(request.id); return; }}>
                      <button type="submit" className="btn btn-primary py-2 px-4 text-xs">
                        Mark Completed
                      </button>
                    </form>
                  ) : null}
                  <span className="pill">{request.status}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="card">No requests assigned yet.</div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
