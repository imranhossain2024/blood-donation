import { setAvailability } from "@/app/actions/donor";
import { Check, XCircle, AlertCircle } from "lucide-react";

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
        <div className="rounded-2xl bg-amber-50/50 p-4 text-xs font-medium text-amber-900 border border-amber-100/50 flex items-start gap-3 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">Not eligible yet</p>
            <p className="mt-0.5 opacity-80 leading-relaxed">
              It&apos;s been {diffDays} days since your last donation. You&apos;ll be ready again in <span className="font-bold">{90 - diffDays} days</span>.
            </p>
          </div>
        </div>
      )}
      
      <div className="flex p-1 bg-brand-50/50 rounded-2xl border border-brand-100 w-fit">
        <form action={async () => {
          "use server";
          await setAvailability("AVAILABLE");
        }}>
          <button
            type="submit"
            disabled={!isEligible}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
              availability === "AVAILABLE" 
                ? "bg-white text-brand-700 shadow-sm border border-brand-100" 
                : "text-ink/40 hover:text-brand-600"
            } ${!isEligible ? "opacity-40 cursor-not-allowed grayscale" : ""}`}
          >
            <Check className={`h-4 w-4 ${availability === "AVAILABLE" ? "scale-110" : "scale-90"}`} />
            Available
          </button>
        </form>

        <form action={async () => {
          "use server";
          await setAvailability("UNAVAILABLE");
        }}>
          <button
            type="submit"
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
              availability === "UNAVAILABLE" 
                ? "bg-white text-brand-700 shadow-sm border border-brand-100" 
                : "text-ink/40 hover:text-brand-600"
            }`}
          >
            <XCircle className={`h-4 w-4 ${availability === "UNAVAILABLE" ? "scale-110" : "scale-90"}`} />
            Unavailable
          </button>
        </form>
      </div>
    </div>
  );
}
