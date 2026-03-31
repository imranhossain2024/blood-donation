import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import Stats from "@/components/Stats";

import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionary";

export default async function Home() {
  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
  const dict = await getDictionary(locale);

  const steps = [
    {
      title: dict.home.step1,
      description: dict.home.step1Desc,
    },
    {
      title: dict.home.step2,
      description: dict.home.step2Desc,
    },
    {
      title: dict.home.step3,
      description: dict.home.step3Desc,
    },
  ];

  return (
    <div>
      <Hero />
      <Stats />

      <section className="container-pad pb-16">
        <SectionHeading
          eyebrow={dict.home.howItWorks}
          title={dict.home.howHeadline}
          subtitle={dict.home.howSub}
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
          eyebrow={dict.home.forTeams}
          title={dict.home.teamsHeadline}
          subtitle={dict.home.teamsSub}
        />
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="card space-y-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-ink/60">
              {dict.home.weekly}
              <span className="text-brand-700">-12% {dict.home.avg}</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-ink/60">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-6 rounded-full bg-brand-500"
                    style={{ height: `${20 + index * 6}px` }}
                  />
                  <span>{dict.home.day} {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
              {dict.home.adminHighlights}
            </div>
            <h3 className="mt-3 text-2xl font-semibold">
              {dict.home.adminTitle}
            </h3>
            <p className="mt-3 text-sm text-ink/70">
              {dict.home.adminDesc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
