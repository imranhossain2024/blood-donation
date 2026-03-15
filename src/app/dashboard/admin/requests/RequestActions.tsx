"use client";

import { adminUpdateRequestStatus, deleteBloodRequest } from "@/app/actions/admin";
import { RequestStatus } from "@prisma/client";
import { useTransition } from "react";

interface RequestActionsProps {
  requestId: string;
  status: RequestStatus;
}

export default function RequestActions({ requestId, status }: RequestActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpdateStatus = async (newStatus: RequestStatus) => {
    startTransition(async () => {
      try {
        await adminUpdateRequestStatus(requestId, newStatus);
      } catch (error) {
        console.error("Failed to update status:", error);
        alert("Failed to update status. Please try again.");
      }
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this request?")) {
      startTransition(async () => {
        try {
          await deleteBloodRequest(requestId);
        } catch (error) {
          console.error("Failed to delete request:", error);
          alert("Failed to delete request. Please try again.");
        }
      });
    }
  };

  return (
    <div className="flex justify-end gap-2">
      {status === "PENDING" && (
        <button
          onClick={() => handleUpdateStatus("ACCEPTED")}
          disabled={isPending}
          title="Accept"
          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
        >
          {isPending ? "..." : "✔️"}
        </button>
      )}
      {status === "ACCEPTED" && (
        <button
          onClick={() => handleUpdateStatus("COMPLETED")}
          disabled={isPending}
          title="Complete"
          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50"
        >
          {isPending ? "..." : "🏆"}
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={isPending}
        title="Delete"
        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
      >
        {isPending ? "..." : "🗑️"}
      </button>
    </div>
  );
}
