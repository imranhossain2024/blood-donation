import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/forms/ContactForm";

export default function ContactPage() {
  return (
    <section className="container-pad py-16">
      <SectionHeading
        eyebrow="Contact"
        title="Reach our response team anytime."
        subtitle="We support hospitals, NGOs, and emergency coordinators 24/7."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card space-y-3">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Hotline
          </div>
          <p className="text-2xl font-semibold">+880 1700 000000</p>
          <p className="text-sm text-ink/70">support@bloodbond.org</p>
          <p className="text-sm text-ink/70">Dhaka, Bangladesh</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
