import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { SystemsShowcase } from "@/components/public/SystemsShowcase";

export const Route = createFileRoute("/systems/")({
  head: () => ({
    meta: [
      { title: "Systems — autonomous-ai-systems" },
      {
        name: "description",
        content: "Browse every autonomous AI system in the lab — live and in design.",
      },
    ],
  }),
  component: SystemsCatalog,
});

function SystemsCatalog() {
  return (
    <PublicShell>
      <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          autonomous-ai-systems / systems
        </div>
        <h1 className="mt-3 text-[36px] font-semibold leading-tight tracking-tight md:text-[44px]">
          Systems
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Every project in the lab — what it does, how it's shaped, and whether
          you can run it live today. Click any system to read its architecture.
        </p>

        <div className="mt-12">
          <SystemsShowcase />
        </div>
      </section>
    </PublicShell>
  );
}
