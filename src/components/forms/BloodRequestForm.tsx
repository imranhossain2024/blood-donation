"use client";
import { createBloodRequest } from "@/app/actions/request";
import Modal from "@/components/Modal";
import { bloodGroupLabels } from "@/lib/utils";
import { bloodGroups } from "@/lib/validators";
import { BloodGroup } from "@prisma/client";
import { useRef, useState } from "react";

type BloodRequestFormProps = {
  donors: {
    id: string;
    name: string | null;
    bloodGroup: string;
    location: string;
  }[];
};

export default function BloodRequestForm({ donors }: BloodRequestFormProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const result = await createBloodRequest(formData);
    setLoading(false);

    if (result?.ok && result.id) {
      setRequestId(result.id);
      setModalOpen(true);
      formRef.current?.reset();
    } else {
      const errMsg = typeof result?.error === "string" 
        ? result.error 
        : "Please check the form for errors.";
      setError(errMsg);
    }
  }

  return (
    <>
      <form ref={formRef} action={handleSubmit} className="card space-y-4">
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Blood group
          </label>
          <select
            name="bloodGroup"
            required
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          >
            <option value="" disabled>
              Select group
            </option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {bloodGroupLabels[group as BloodGroup]}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Units
            </label>
            <input
              name="units"
              type="number"
              min={1}
              max={10}
              required
              className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Needed by
            </label>
            <input
              name="neededAt"
              type="date"
              required
              className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Location
          </label>
          <input
            name="location"
            type="text"
            required
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Preferred donor (optional)
          </label>
          <select
            name="donorId"
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          >
            <option value="">Auto-assign later</option>
            {donors.map((donor) => (
              <option key={donor.id} value={donor.id}>
                {donor.name ?? "Donor"} - {bloodGroupLabels[donor.bloodGroup as BloodGroup]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Notes (optional)
          </label>
          <textarea
            name="note"
            rows={3}
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          />
        </div>
        {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit request"}
        </button>
      </form>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Request Submitted!">
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-lg font-semibold text-brand-700">Your blood request has been sent successfully.</div>
          <div className="rounded-xl bg-brand-50 px-4 py-2 border border-brand-100 mt-2">
            <span className="text-[10px] uppercase tracking-widest text-ink/40 block text-center mb-1">Request Number</span>
            <code className="text-brand-800 font-bold">{requestId}</code>
          </div>
          <div className="text-sm text-ink/70 mt-2 text-center">We will notify available donors soon. You can track your request from the dashboard.</div>
          <button className="btn btn-primary mt-4" onClick={() => setModalOpen(false)}>
            Done
          </button>
        </div>
      </Modal>
    </>
  );
}
