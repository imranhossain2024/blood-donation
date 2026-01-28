import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";
import { cancelRequest } from "@/app/actions/request";
import { bloodGroupLabels } from "@/lib/utils";

export default async function RequestsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const requests = await prisma.bloodRequest.findMany({
    where: { requesterId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell title="Requests" description="Track your blood requests.">
      <div className="grid gap-4">
        {requests.length ? (
          requests.map((request) => (
            <div key={request.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold">
                    {bloodGroupLabels[request.bloodGroup]} - {request.units} units
                  </h3>
                  <p className="mt-1 text-sm text-ink/70">{request.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="pill">{request.status}</span>
                  {request.status === "PENDING" ? (
                    <form action={cancelRequest.bind(null, request.id)}>
                      <button type="submit" className="btn btn-outline">
                        Cancel
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card">No requests yet.</div>
        )}
      </div>
    </DashboardShell>
  );
}

