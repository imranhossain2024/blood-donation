import { bloodGroupLabels } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
  COMPLETED: "bg-slate-200 text-slate-700",
  CANCELLED: "bg-slate-100 text-slate-500",
};

type RequestCardProps = {
  request: {
    id: string;
    bloodGroup: string;
    units: number;
    location: string;
    neededAt: Date;
    status: string;
  };
};

export default function RequestCard({ request }: RequestCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Needed by {new Date(request.neededAt).toLocaleDateString()}
          </div>
          <h3 className="mt-2 text-xl font-semibold">
            {bloodGroupLabels[request.bloodGroup] ?? request.bloodGroup} - {request.units} units
          </h3>
          <p className="mt-1 text-sm text-ink/70">{request.location}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusStyles[request.status] ?? "bg-slate-100 text-slate-600"
          }`}
        >
          {request.status}
        </span>
      </div>
    </div>
  );
}
