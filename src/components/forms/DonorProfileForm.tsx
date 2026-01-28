import { upsertDonorProfile } from "@/app/actions/donor";
import { bloodGroups } from "@/lib/validators";
import { bloodGroupLabels } from "@/lib/utils";

const availabilityOptions = [
  { value: "AVAILABLE", label: "Available" },
  { value: "UNAVAILABLE", label: "Not available" },
];

type DonorProfileFormProps = {
  profile?: {
    bloodGroup: string;
    location: string;
    availability: string;
    lastDonationDate: Date | null;
  } | null;
};

export default function DonorProfileForm({ profile }: DonorProfileFormProps) {
  return (
    <form action={upsertDonorProfile} className="card space-y-4">
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
              {bloodGroupLabels[group]}
            </option>
          ))}
        </select>
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
      </div>
      <button type="submit" className="btn btn-primary">
        Save donor profile
      </button>
    </form>
  );
}
