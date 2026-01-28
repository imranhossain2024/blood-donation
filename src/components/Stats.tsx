const stats = [
  { label: "Active donors", value: "1,240+" },
  { label: "Requests handled", value: "3,980+" },
  { label: "Average response", value: "18 min" },
];

export default function Stats() {
  return (
    <section className="container-pad pb-16">
      <div className="grid gap-6 rounded-3xl border border-brand-100 bg-white/80 p-8 text-center shadow-card md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-3xl font-semibold text-brand-700 md:text-4xl">
              {stat.value}
            </div>
            <div className="mt-2 text-sm text-ink/70">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
