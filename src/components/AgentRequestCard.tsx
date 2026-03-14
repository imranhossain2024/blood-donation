"use client";

import { approveRequest } from "@/app/actions/agent";
import { format } from "date-fns";
import { useState } from "react";

type RequestCardProps = {
  request: {
    id: string;
    bloodGroup: string;
    units: number;
    location: string;
    neededAt: Date;
    note: string | null;
    requester: {
      name: string | null;
      email: string | null;
      phone: string | null;
    };
  };
};

export default function AgentRequestCard({ request }: RequestCardProps) {
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  async function handleApprove() {
    if (!confirm("Are you sure you want to approve this request?")) return;
    
    setLoading(true);
    const result = await approveRequest(request.id);
    setLoading(false);

    if (result.success) {
      setApproved(true);
    } else {
      alert("Failed to approve request");
    }
  }

  if (approved) return null; // Remove from list after approval

  return (
    <div className="card border-l-4 border-l-brand-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-brand-900">{request.bloodGroup} Request</h3>
          <p className="text-sm text-ink/60">{request.location}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-brand-600">{request.units} Unit(s)</div>
          <div className="text-xs text-ink/50">{format(new Date(request.neededAt), "PP")}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-brand-50 space-y-2">
        <p className="text-sm"><span className="font-semibold">Requester:</span> {request.requester.name || "Anonymous"}</p>
        {request.requester.phone && (
           <p className="text-sm"><span className="font-semibold">Phone:</span> {request.requester.phone}</p>
        )}
        {request.note && (
          <p className="text-sm bg-brand-50 p-2 rounded-lg italic text-ink/70">&quot;{request.note}&quot;</p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button 
          onClick={handleApprove} 
          disabled={loading}
          className="btn btn-primary w-full py-2 text-sm"
        >
          {loading ? "Approving..." : "Approve Request"}
        </button>
      </div>
    </div>
  );
}
