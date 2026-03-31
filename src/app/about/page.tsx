import SectionHeading from "@/components/SectionHeading";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionary";

export default async function AboutPage() {
  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
  const dict = await getDictionary(locale);

  return (
    <section className="container-pad py-16">
      <SectionHeading
        eyebrow={dict.aboutPage.eyebrow}
        title={dict.aboutPage.title}
        subtitle={dict.aboutPage.subtitle}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h3 className="text-2xl font-semibold">{dict.aboutPage.whyTitle}</h3>
          <p className="mt-3 text-sm text-ink/70">
            {dict.aboutPage.whyDesc}
          </p>
        </div>
        <div className="card">
          <h3 className="text-2xl font-semibold">{dict.aboutPage.howTitle}</h3>
          <p className="mt-3 text-sm text-ink/70">
            {dict.aboutPage.howDesc}
          </p>
        </div>
      </div>
    </section>
  );
}
