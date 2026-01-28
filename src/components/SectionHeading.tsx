type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export default function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-3 text-ink/70">{subtitle}</p> : null}
    </div>
  );
}
