"use client";

import { upsertDonorProfile, type DonorProfileState } from "@/app/actions/donor";
import Modal from "@/components/Modal";
import { bloodGroupLabels } from "@/lib/utils";
import { bloodGroups } from "@/lib/validators";
import { BloodGroup } from "@prisma/client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const availabilityOptions = [
  { value: "AVAILABLE", label: "Available" },
  { value: "UNAVAILABLE", label: "Not available" },
];

type DonorProfileFormProps = {
  profile?: {
    bloodGroup: string;
    location: string;
    phone?: string | null;
    availability: string;
    lastDonationDate: Date | null;
  } | null;
};

const initialState: DonorProfileState = { ok: true };

export default function DonorProfileForm({ profile }: DonorProfileFormProps) {
  const [state, formAction] = useFormState(upsertDonorProfile, initialState);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (state && state.ok && !state.error) {
      setModalOpen(true);
    }
  }, [state]);

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Profile Updated!">
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-lg font-semibold text-brand-700">Donor profile saved successfully.</div>
          <p className="text-sm text-ink/70 text-center">Your availability and info were updated.</p>
          <button className="btn btn-primary mt-4" onClick={() => setModalOpen(false)}>
            Close
          </button>
        </div>
      </Modal>
      <form action={formAction} className="card space-y-4">
      <div>
        <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
          Blood group
        </label>
        <select
          name="bloodGroup"
          defaultValue={profile?.bloodGroup ?? ""}
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
        {state?.error && typeof state.error === "object" && "bloodGroup" in state.error ? (
          <p className="mt-2 text-xs text-brand-700">{(state.error as any).bloodGroup?.[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
          Location
        </label>
        <input
          name="location"
          type="text"
          defaultValue={profile?.location ?? ""}
          required
          className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
        />
        {state?.error && typeof state.error === "object" && "location" in state.error ? (
          <p className="mt-2 text-xs text-brand-700">{(state.error as any).location?.[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
          Phone
        </label>
        <input
          name="phone"
          type="text"
          defaultValue={profile?.phone ?? ""}
          required
          placeholder="e.g. +880123456789"
          className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
        />
        {state?.error && typeof state.error === "object" && "phone" in state.error ? (
          <p className="mt-2 text-xs text-brand-700">{(state.error as any).phone?.[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
          Availability
        </label>
        <select
          name="availability"
          defaultValue={profile?.availability ?? "AVAILABLE"}
          className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
        >
          {availabilityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {state?.error && typeof state.error === "object" && "availability" in state.error ? (
          <p className="mt-2 text-xs text-brand-700">{(state.error as any).availability?.[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
          Last donation date
        </label>
        <input
          name="lastDonationDate"
          type="date"
          defaultValue={
            profile?.lastDonationDate
              ? new Date(profile.lastDonationDate).toISOString().slice(0, 10)
              : ""
          }
          className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
        />
        {state?.error && typeof state.error === "object" && "lastDonationDate" in state.error ? (
          <p className="mt-2 text-xs text-brand-700">{(state.error as any).lastDonationDate?.[0]}</p>
        ) : null}
      </div>
      {state?.error && typeof state.error === "string" ? (
        <p className="mt-2 text-center text-xs text-brand-700 font-bold">{state.error}</p>
      ) : null}
      <button type="submit" className="btn btn-primary">
        Save donor profile
      </button>
    </form>
    </>
  );
}
