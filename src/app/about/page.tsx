import SectionHeading from "@/components/SectionHeading";

export default function AboutPage() {
  return (
    <section className="container-pad py-16">
      <SectionHeading
        eyebrow="Our mission"
        title="Building a safer, faster blood donation network."
        subtitle="BloodBond bridges donors, hospitals, and recipients with verified data and real-time coordination."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h3 className="text-2xl font-semibold">Why we exist</h3>
          <p className="mt-3 text-sm text-ink/70">
            Emergency blood requests often rely on fragmented phone calls and
            personal networks. BloodBond digitizes the flow so every request is
            logged, tracked, and matched with verified donors.
          </p>
        </div>
        <div className="card">
          <h3 className="text-2xl font-semibold">How we protect donors</h3>
          <p className="mt-3 text-sm text-ink/70">
            Donor profiles are approved by administrators, availability is
            managed by the donor, and each request has a clear audit trail.
          </p>
        </div>
      </div>
    </section>
  );
}
