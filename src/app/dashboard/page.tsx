
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
      <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        <div className="card flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60 mb-1">Role</div>
          <h3 className="text-lg sm:text-2xl font-bold mb-0.5 break-words">{session.user.role}</h3>
          <p className="text-[10px] sm:text-sm text-ink/70 mb-2 line-clamp-1">{profile ? "Active" : "New User"}</p>
          <Link href="/profile" className="btn btn-outline w-full py-1.5 sm:py-2.5 text-[10px] sm:text-sm px-2">Profile</Link>
        </div>
        <div className="card flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60 mb-1">Requests</div>
          <h3 className="text-lg sm:text-2xl font-bold mb-0.5">{requests.length}</h3>
          <p className="text-[10px] sm:text-sm text-ink/70 mb-2">Recent requests</p>
          <Link href="/dashboard/requests" className="btn btn-outline w-full py-1.5 sm:py-2.5 text-[10px] sm:text-sm px-2">View</Link>
        </div>
        <div className="card flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60 mb-1">Notifications</div>
          <h3 className="text-lg sm:text-2xl font-bold mb-0.5">{notifications.length}</h3>
          <p className="text-[10px] sm:text-sm text-ink/70 mb-2">Notifications</p>
          <Link href="/profile" className="btn btn-outline w-full py-1.5 sm:py-2.5 text-[10px] sm:text-sm px-2">Inbox</Link>
        </div>
        <div className="card flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60 mb-1">Donor Center</div>
          <h3 className="text-lg sm:text-2xl font-bold mb-0.5">{history.length}</h3>
          <p className="text-[10px] sm:text-sm text-ink/70 mb-2">Donations</p>
          <Link href="/dashboard/donor" className="btn btn-outline w-full py-1.5 sm:py-2.5 text-[10px] sm:text-sm px-2">Donor</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-2">
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
