import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/project/ProjectCard";

export function SystemsShowcase() {
  const live = projects.filter((p) => p.status === "completed");
  const planned = projects.filter((p) => p.status === "planned");

  return (
    <section className="space-y-10">
      <Group label={`Live systems · ${live.length}`} hint="ready to run in the lab">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {live.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </Group>

      <Group label={`In design · ${planned.length}`} hint="architecture previews">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {planned.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </Group>
    </section>
  );
}

function Group({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground">
          {label}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {hint}
        </div>
      </div>
      {children}
    </div>
  );
}
