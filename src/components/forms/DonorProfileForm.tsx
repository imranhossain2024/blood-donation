"use client";

import { upsertDonorProfile, type DonorProfileState } from "@/app/actions/donor";
import { bloodGroupLabels } from "@/lib/utils";
import { bloodGroups } from "@/lib/validators";
import { BloodGroup } from "@prisma/client";
import { CheckCircle2, Save } from "lucide-react";
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
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state && state.ok && !state.error && state !== initialState) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <form action={formAction} className="card relative space-y-6 fade-up">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-brand-900">Donor Profile</h3>
        {showSuccess && (
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600 animate-in fade-in slide-in-from-right-4">
            <CheckCircle2 className="h-4 w-4" />
            Saved!
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-bold ml-1">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            defaultValue={profile?.bloodGroup ?? ""}
            required
            className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
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
            <p className="px-1 text-[10px] text-brand-700 font-medium">{(state.error as Record<string, string[]>).bloodGroup?.[0]}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-bold ml-1">
            Location
          </label>
          <input
            name="location"
            type="text"
            defaultValue={profile?.location ?? ""}
            required
            placeholder="City, Hospital or Area"
            className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
          />
          {state?.error && typeof state.error === "object" && "location" in state.error ? (
            <p className="px-1 text-[10px] text-brand-700 font-medium">{(state.error as Record<string, string[]>).location?.[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-bold ml-1">
            Phone
          </label>
          <input
            name="phone"
            type="text"
            defaultValue={profile?.phone ?? ""}
            required
            placeholder="+8801..."
            className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
          />
          {state?.error && typeof state.error === "object" && "phone" in state.error ? (
            <p className="px-1 text-[10px] text-brand-700 font-medium">{(state.error as Record<string, string[]>).phone?.[0]}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-bold ml-1">
            Last Donation
          </label>
          <input
            name="lastDonationDate"
            type="date"
            defaultValue={
              profile?.lastDonationDate
                ? new Date(profile.lastDonationDate).toISOString().slice(0, 10)
                : ""
            }
            className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
          />
          {state?.error && typeof state.error === "object" && "lastDonationDate" in state.error ? (
            <p className="px-1 text-[10px] text-brand-700 font-medium">{(state.error as Record<string, string[]>).lastDonationDate?.[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-bold ml-1">
            Availability
          </label>
          <select
            name="availability"
            defaultValue={profile?.availability ?? "AVAILABLE"}
            className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
          >
            {availabilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {state?.error && typeof state.error === "object" && "availability" in state.error ? (
            <p className="px-1 text-[10px] text-brand-700 font-medium">{(state.error as Record<string, string[]>).availability?.[0]}</p>
          ) : null}
      </div>

      {state?.error && typeof state.error === "string" ? (
        <div className="rounded-xl bg-red-50 p-3 text-[10px] font-medium text-red-800 border border-red-100">
          {state.error}
        </div>
      ) : null}

      <button type="submit" className="btn btn-primary w-full group">
        <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
        Save Profile
      </button>
    </form>
  );
}
