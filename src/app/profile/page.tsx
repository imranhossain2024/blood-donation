import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfile } from "@/app/actions/auth";
import { bloodGroupLabels } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      donorProfile: true,
      requests: {
        select: { id: true, status: true },
      },
      _count: {
        select: {
          historyAsDonor: true,
          historyAsRequester: true,
          requests: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return (
    <section className="container-pad py-16">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="card">
            <h1 className="text-3xl font-semibold">Edit profile</h1>
            <p className="mt-2 text-sm text-ink/70">
              Update your display name and account information.
            </p>
            <form action={updateProfile} className="mt-6 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
                  Full name
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={user.name ?? ""}
                  required
                  className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email ?? ""}
                  disabled
                  className="mt-2 w-full rounded-2xl border border-brand-100 bg-gray-50 px-4 py-3 text-sm text-ink/60"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
                  Account role
                </label>
                <div className="mt-2 w-full rounded-2xl border border-brand-100 bg-gray-50 px-4 py-3 text-sm text-ink/60">
                  {user.role === "ADMIN" && (
                    <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      Admin
                    </span>
                  )}
                  {user.role === "DONOR" && (
                    <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Donor
                    </span>
                  )}
                  {user.role === "USER" && (
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      User
                    </span>
                  )}
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
            </form>
          </div>

          {/* Donor Profile Section */}
          {user.donorProfile && (
            <div className="card">
              <h2 className="text-2xl font-semibold">Donor Profile</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
                    Blood group
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {bloodGroupLabels[user.donorProfile.bloodGroup]}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
                    Location
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {user.donorProfile.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
                    Availability
                  </p>
                  <p className="mt-2">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      user.donorProfile.availability === "AVAILABLE"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {user.donorProfile.availability}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
                    Approval status
                  </p>
                  <p className="mt-2">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      user.donorProfile.approved
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {user.donorProfile.approved ? "Approved" : "Pending approval"}
                    </span>
                  </p>
                </div>
                {user.donorProfile.lastDonationDate && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
                      Last donation
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {new Date(user.donorProfile.lastDonationDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Member since
            </p>
            <p className="mt-2 text-lg font-semibold">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="card">
            <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Blood requests
            </p>
            <p className="mt-2 text-3xl font-semibold text-brand-600">
              {user._count.requests}
            </p>
          </div>

          {user._count.historyAsDonor > 0 && (
            <div className="card">
              <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
                Donations made
              </p>
              <p className="mt-2 text-3xl font-semibold text-emerald-600">
                {user._count.historyAsDonor}
              </p>
            </div>
          )}

          {user._count.historyAsRequester > 0 && (
            <div className="card">
              <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
                Requests completed
              </p>
              <p className="mt-2 text-3xl font-semibold text-blue-600">
                {user._count.historyAsRequester}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
