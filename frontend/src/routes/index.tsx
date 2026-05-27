import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { LandingHero } from "@/components/public/LandingHero";
import { PhilosophyStrip } from "@/components/public/PhilosophyStrip";
import { SystemsShowcase } from "@/components/public/SystemsShowcase";
import { ArchitectureDiagram } from "@/components/public/ArchitectureDiagram";
import { AboutEngineer } from "@/components/public/AboutEngineer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "autonomous-ai-systems — a working lab of practical AI systems" },
      {
        name: "description",
        content:
          "An engineering lab of autonomous AI systems. Read the architecture, then run the system live. Research agents, codebase intelligence, self-correcting loops, and more.",
      },
      { property: "og:title", content: "autonomous-ai-systems" },
      {
        property: "og:description",
        content:
          "A growing collection of practical autonomous AI engineering projects — built, explained, and exposed interactively.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <PublicShell>
      <LandingHero />
      <PhilosophyStrip />

      <section className="mx-auto w-full max-w-[1400px] px-6 py-20 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
              what this is
            </div>
            <h2 className="mt-3 text-[28px] font-semibold leading-tight tracking-tight md:text-[32px]">
              A continuous engineering initiative — not a product.
            </h2>
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              <span className="text-foreground">autonomous-ai-systems</span> is
              a growing collection of practical AI engineering projects. Each
              system is a self-contained experiment in how to build, observe,
              and reason about autonomous behavior.
            </p>
            <p>
              The repository is built in public. New systems are added as they
              mature; in-design systems are documented with their intended
              architecture before any code lands. The goal is to make AI
              systems engineering legible — by showing the loops, the traces,
              and the contracts that make these systems work.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-6 pb-20 md:px-10 md:pb-24">
        <SystemsShowcase />
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-6 pb-20 md:px-10 md:pb-24">
        <div className="mb-6 flex items-baseline justify-between">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground">
            how a system is shaped
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            shared loop · specialized per system
          </div>
        </div>
        <ArchitectureDiagram />
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-6 pb-24 md:px-10 md:pb-28">
        <AboutEngineer />
      </section>
    </PublicShell>
  );
}
