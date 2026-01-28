import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import Stats from "@/components/Stats";

const steps = [
  {
    title: "Create your profile",
    description:
      "Register once, then add your blood group, location, and availability.",
  },
  {
    title: "Find and request",
    description:
      "Search verified donors by blood group and location in seconds.",
  },
  {
    title: "Track outcomes",
    description:
      "Monitor the request status and donation history from your dashboard.",
  },
];

export default function Home() {
  return (
    <div>
      <Hero />
      <Stats />

      <section className="container-pad pb-16">
        <SectionHeading
          eyebrow="How it works"
          title="Coordinate every step from request to donation."
          subtitle="Build trust with verification, transparent status updates, and donor analytics."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="card">
              <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
                Step {index + 1}
              </div>
              <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-pad pb-20">
        <SectionHeading
          eyebrow="For teams"
          title="Powerful admin controls and analytics."
          subtitle="Track active donors, monitor pending requests, and measure response time trends."
        />
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="card space-y-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-ink/60">
              Weekly response time
              <span className="text-brand-700">-12% avg.</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-ink/60">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-6 rounded-full bg-brand-500"
                    style={{ height: `${20 + index * 6}px` }}
                  />
                  <span>Day {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Admin highlights
            </div>
            <h3 className="mt-3 text-2xl font-semibold">
              See donor approval, active requests, and response trends in one place.
            </h3>
            <p className="mt-3 text-sm text-ink/70">
              Use dashboard filters to focus on urgent cases and manage availability in real time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
