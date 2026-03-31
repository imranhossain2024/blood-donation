import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/forms/ContactForm";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionary";

export default async function ContactPage() {
  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
  const dict = await getDictionary(locale);

  return (
    <section className="container-pad py-16">
      <SectionHeading
        eyebrow={dict.contactPage.eyebrow}
        title={dict.contactPage.title}
        subtitle={dict.contactPage.subtitle}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card space-y-3">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
            {dict.contactPage.hotline}
          </div>
          <p className="text-2xl font-semibold">{dict.contactPage.phone}</p>
          <p className="text-sm text-ink/70">{dict.contactPage.email}</p>
          <p className="text-sm text-ink/70">{dict.contactPage.address}</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
