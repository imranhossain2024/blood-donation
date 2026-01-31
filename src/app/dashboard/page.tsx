
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import RequestCard from "@/components/RequestCard";
import Link from "next/link";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  // Fetch user data
  const [profile, requests, notifications, history] = await Promise.all([
    prisma.donorProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.bloodRequest.findMany({
      where: { requesterId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.notification.findMany({
      where: { userId: session.user.id, read: false },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.donationHistory.findMany({
      where: { requesterId: session.user.id },
      orderBy: { donatedAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <DashboardShell
      title={`Welcome, ${session.user.name ?? "there"}`}
      description="Quickly access your most important features."
    >
      <div className="grid gap-6 md:grid-cols-4">
        <div className="card flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60 mb-1">Role</div>
          <h3 className="text-2xl font-semibold mb-1">{session.user.role}</h3>
          <p className="text-sm text-ink/70 mb-2">{profile ? "Donor profile active" : "Not a donor yet"}</p>
          <Link href="/profile" className="btn btn-outline w-full">Profile</Link>
        </div>
        <div className="card flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60 mb-1">Requests</div>
          <h3 className="text-2xl font-semibold mb-1">{requests.length}</h3>
          <p className="text-sm text-ink/70 mb-2">Recent blood requests</p>
          <Link href="/dashboard/requests" className="btn btn-outline w-full">View Requests</Link>
        </div>
        <div className="card flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60 mb-1">Notifications</div>
          <h3 className="text-2xl font-semibold mb-1">{notifications.length}</h3>
          <p className="text-sm text-ink/70 mb-2">Unread notifications</p>
          <Link href="/profile" className="btn btn-outline w-full">Notifications</Link>
        </div>
        <div className="card flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60 mb-1">Donor Center</div>
          <h3 className="text-2xl font-semibold mb-1">{history.length}</h3>
          <p className="text-sm text-ink/70 mb-2">Recent donations</p>
          <Link href="/dashboard/donor" className="btn btn-outline w-full">Donor Center</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Recent Requests</h2>
            <Link href="/dashboard/requests" className="text-brand-700 text-sm">See all</Link>
          </div>
          {requests.length === 0 ? (
            <div className="text-sm text-ink/60">No recent requests.</div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <RequestCard key={req.id} request={req} />
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Recent Donations</h2>
            <Link href="/dashboard/donor" className="text-brand-700 text-sm">Donor Center</Link>
          </div>
          {history.length === 0 ? (
            <div className="text-sm text-ink/60">No donation history yet.</div>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-ink/60">{new Date(h.donatedAt).toLocaleDateString()}</div>
                      <div className="font-semibold">{h.units} units donated</div>
                    </div>
                    <div className="text-xs text-ink/60">{h.note}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
