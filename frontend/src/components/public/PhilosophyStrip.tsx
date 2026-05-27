const items = [
  {
    label: "Practical, not theoretical",
    body: "Every system here is implemented end-to-end and runnable. Architecture diagrams reflect code that exists.",
  },
  {
    label: "Architecture-first",
    body: "Loops, traces, and contracts are first-class. The interesting question is always how the system is shaped.",
  },
  {
    label: "Interactive by default",
    body: "Reading the design is one click away from running it. The frontend is the lab bench, not the brochure.",
  },
];

export function PhilosophyStrip() {
  return (
    <section className="border-b border-border-subtle bg-surface-1/30">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-px overflow-hidden bg-border-subtle md:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="bg-background px-6 py-8 md:px-10 md:py-10">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-accent">
              {it.label}
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
