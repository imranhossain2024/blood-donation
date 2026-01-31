import { setAvailability } from "@/app/actions/donor";

type AvailabilityToggleProps = {
  availability: "AVAILABLE" | "UNAVAILABLE";
  lastDonationDate?: Date | null;
};

export default function AvailabilityToggle({ availability, lastDonationDate }: AvailabilityToggleProps) {
  const diffTime = lastDonationDate ? Math.abs(new Date().getTime() - new Date(lastDonationDate).getTime()) : Infinity;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isEligible = diffDays >= 90;

  return (
    <div className="space-y-4">
      {!isEligible && (
        <div className="rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-800 border border-amber-100 flex items-start gap-2">
          <span className="text-base leading-none">⚠️</span>
          <div>
            <p className="font-bold">Not eligible to donate yet</p>
            <p className="mt-0.5 opacity-80">You donated {diffDays} days ago. Please wait {90 - diffDays} more days to become available again.</p>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <form action={async (_formData: FormData) => {
          "use server";
          await setAvailability("AVAILABLE");
          return;
        }}>
          <button
            type="submit"
            disabled={!isEligible}
            className={`btn ${availability === "AVAILABLE" ? "btn-primary" : "btn-outline"} ${!isEligible ? "opacity-50 cursor-not-allowed" : ""}`}
            title={!isEligible ? "You must wait 90 days between donations" : ""}
          >
            Available
          </button>
        </form>
        <form action={async (_formData: FormData) => {
          "use server";
          await setAvailability("UNAVAILABLE");
          return;
        }}>
          <button
            type="submit"
            className={`btn ${availability === "UNAVAILABLE" ? "btn-primary" : "btn-outline"}`}
          >
            Not available
          </button>
        </form>
      </div>
    </div>
  );
}
