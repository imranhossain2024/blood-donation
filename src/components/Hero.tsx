import { Droplet, HeartPulse, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionary";

export default async function Hero() {
  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
  const dict = await getDictionary(locale);

  const features = [
    {
      icon: Droplet,
      title: dict.hero.f1Title,
      description: dict.hero.f1Desc,
    },
    {
      icon: HeartPulse,
      title: dict.hero.f2Title,
      description: dict.hero.f2Desc,
    },
    {
      icon: ShieldCheck,
      title: dict.hero.f3Title,
      description: dict.hero.f3Desc,
    },
  ];

  return (
    <section className="container-pad grid gap-10 pb-16 pt-16 md:grid-cols-[1.2fr_0.8fr] md:items-center">
      <div className="fade-up">
        <div className="pill">{dict.hero.pill}</div>
        <h1 className="mt-5 text-4xl font-semibold leading-tight text-balance md:text-5xl">
          {dict.hero.heading}
        </h1>
        <p className="mt-4 text-base text-ink/70 md:text-lg">
          {dict.hero.subheading}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/donor" className="btn btn-primary">
            {dict.hero.donorBtn}
          </Link>
          <Link href="/request" className="btn btn-outline">
            {dict.hero.requestBtn}
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((item, index) => {
            const delays = ["fade-up-delay-1", "fade-up-delay-2", "fade-up-delay-3"];
            return (
            <div
              key={item.title}
              className={`rounded-2xl border border-brand-100 bg-white/80 p-4 fade-up ${delays[index]}`}
            >
              <item.icon className="h-6 w-6 text-brand-600" />
              <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{item.description}</p>
            </div>
            );
          })}
        </div>
      </div>

      <div className="relative fade-up fade-up-delay-2">
        <div className="card bg-white/90">
          <h2 className="text-2xl font-semibold">{dict.hero.urgentTitle}</h2>
          <p className="mt-2 text-sm text-ink/70">
            {dict.hero.urgentDesc}
          </p>
          <div className="mt-6 space-y-4">
            {[
              { group: "O+", location: "Dhanmondi", units: 2 },
              { group: "A-", location: "Gulshan", units: 1 },
              { group: "B+", location: "Mirpur", units: 3 },
            ].map((item) => (
              <div
                key={`${item.group}-${item.location}`}
                className="flex items-center justify-between rounded-2xl bg-sand px-4 py-3"
              >
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-ink/50">
                    {item.location}
                  </div>
                  <div className="text-lg font-semibold text-ink">{item.group}</div>
                </div>
                <div className="text-sm font-semibold text-brand-700">
                  {item.units} {dict.hero.units}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-6 -left-6 hidden h-20 w-20 rounded-full bg-brand-200/70 md:block" />
      </div>
    </section>
  );
}
