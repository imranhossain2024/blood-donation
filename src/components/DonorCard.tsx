import { bloodGroupLabels } from "@/lib/utils";

type DonorCardProps = {
  donor: {
    id: string;
    bloodGroup: string;
    location: string;
    availability: string;
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
  };
};

export default function DonorCard({ donor }: DonorCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
            {donor.location}
          </div>
          <h3 className="mt-2 text-xl font-semibold">
            {donor.user.name ?? "Anonymous Donor"}
          </h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-lg font-semibold text-white">
          {bloodGroupLabels[donor.bloodGroup] ?? donor.bloodGroup}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="pill">
          {donor.availability === "AVAILABLE" ? "Available" : "Not available"}
        </span>
        <span className="text-ink/60">{donor.user.email ?? ""}</span>
      </div>
    </div>
  );
}
