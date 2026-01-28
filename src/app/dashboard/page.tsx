import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import RequestCard from "@/components/RequestCard";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const [profile, requests, notifications, history] = await Promise.all([
    prisma.donorProfile.findUnique({
      where: { userId: session.user.id },
    }),
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
      where: {
        requesterId: session.user.id,
      },
      orderBy: { donatedAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <DashboardShell
      title={`Hello, ${session.user.name ?? "there"}`}
      description="Track your requests, donor status, and notifications."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Role
          </div>
          <h3 className="mt-2 text-2xl font-semibold">{session.user.role}</h3>
          <p className="mt-2 text-sm text-ink/70">
            {profile ? "Donor profile active" : "Not a donor yet"}
          </p>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Active requests
          </div>
          <h3 className="mt-2 text-2xl font-semibold">{requests.length}</h3>
          <Link href="/dashboard/requests" className="mt-2 inline-flex text-sm text-brand-700">
            View all requests
          </Link>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
            New notifications
          </div>
          <h3 className="mt-2 text-2xl font-semibold">{notifications.length}</h3>
          <p className="mt-2 text-sm text-ink/70">Keep an eye on updates.</p>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Recent requests</h3>
          <Link href="/request" className="btn btn-primary">
            New request
          </Link>
        </div>
        <div className="grid gap-4">
          {requests.length ? (
            requests.map((request) => <RequestCard key={request.id} request={request} />)
          ) : (
            <div className="card">No requests yet.</div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Donation history</h3>
        </div>
        <div className="grid gap-4">
          {history.length ? (
            history.map((item) => (
              <div key={item.id} className="card">
                <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
                  {new Date(item.donatedAt).toLocaleDateString()}
                </div>
                <h4 className="mt-2 text-xl font-semibold">{item.units} units donated</h4>
                <p className="mt-2 text-sm text-ink/70">{item.note ?? "-"}</p>
              </div>
            ))
          ) : (
            <div className="card">No donation history yet.</div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Latest notifications</h3>
        </div>
        <div className="grid gap-4">
          {notifications.length ? (
            notifications.map((note) => (
              <div key={note.id} className="card">
                <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
                <h4 className="mt-2 text-xl font-semibold">{note.title}</h4>
                <p className="mt-2 text-sm text-ink/70">{note.message}</p>
              </div>
            ))
          ) : (
            <div className="card">No new notifications.</div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
