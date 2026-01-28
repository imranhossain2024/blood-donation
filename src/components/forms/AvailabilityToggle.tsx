import { setAvailability } from "@/app/actions/donor";

type AvailabilityToggleProps = {
  availability: "AVAILABLE" | "UNAVAILABLE";
};

export default function AvailabilityToggle({ availability }: AvailabilityToggleProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <form action={setAvailability.bind(null, "AVAILABLE")}>
        <button
          type="submit"
          className={`btn ${availability === "AVAILABLE" ? "btn-primary" : "btn-outline"}`}
        >
          Available
        </button>
      </form>
      <form action={setAvailability.bind(null, "UNAVAILABLE")}>
        <button
          type="submit"
          className={`btn ${availability === "UNAVAILABLE" ? "btn-primary" : "btn-outline"}`}
        >
          Not available
        </button>
      </form>
    </div>
  );
}
