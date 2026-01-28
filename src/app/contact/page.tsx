import SectionHeading from "@/components/SectionHeading";
import { sendContactMessage } from "@/app/actions/contact";

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
        <div className="card">
          <h3 className="text-2xl font-semibold">Message us</h3>
          <p className="mt-2 text-sm text-ink/70">
            Share your hospital details or partnership idea. We will respond
            within 24 hours.
          </p>
          <form action={sendContactMessage} className="mt-4 space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
              className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
            />
            <textarea
              rows={4}
              name="message"
              placeholder="Message"
              required
              className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
            />
            <button type="submit" className="btn btn-primary">
              Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
