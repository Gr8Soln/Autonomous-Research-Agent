import { Link } from "@tanstack/react-router";
import { ArrowRight, Github } from "lucide-react";
import type { Project } from "@/lib/projects";
import { StatusDot } from "@/components/surfaces/StatusDot";
import { CapabilityTag } from "@/components/project/CapabilityTag";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

export function SystemOverview({ project }: { project: Project }) {
  const completed = project.status === "completed";

  return (
    <article className="mx-auto w-full max-w-[1100px] px-6 py-12 md:px-10 md:py-16">
      <Link
        to={"/systems" as any}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
      >
        ← all systems
      </Link>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <StatusDot status={completed ? "live" : "planned"} pulse={completed} />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
              {project.category}
            </span>
            {project.version && (
              <span className="font-mono text-[10.5px] text-muted-foreground/70">
                · {project.version}
              </span>
            )}
          </div>
          <h1 className="mt-3 text-[34px] font-semibold leading-tight tracking-tight md:text-[40px]">
            {project.name}
          </h1>
          <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-muted-foreground">
            {project.tagline}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {completed ? (
            <Link
              to={"/lab/$slug" as any}
              params={{ slug: project.slug } as any}
              className="group inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:opacity-90"
            >
              Run live
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <Link
              to={"/lab/$slug" as any}
              params={{ slug: project.slug } as any}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border-strong bg-surface-2 px-4 text-sm font-medium text-foreground transition hover:bg-surface-3"
            >
              Preview architecture
            </Link>
          )}
          <a
            href={project.links?.github ?? "https://github.com/"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border-subtle bg-surface-1 px-4 text-sm font-medium text-muted-foreground transition hover:border-border-strong hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.capabilities.map((c) => (
          <CapabilityTag key={c} muted={!completed}>
            {c}
          </CapabilityTag>
        ))}
      </div>

      <section className="mt-12 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground">
            overview
          </div>
          {project.longDescription.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface-1/60 p-5">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            tech stack
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.techStack.map((t) => (
              <li key={t} className="rounded border border-border-subtle bg-surface-2/70 px-2 py-1 font-mono text-[11px] text-foreground/90">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground">
          architecture
        </div>
        <ArchitectureDiagram />
        <ul className="mt-5 grid gap-2 md:grid-cols-2">
          {project.architectureSummary.map((line, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-border-subtle bg-surface-1/60 px-4 py-3 text-[13.5px] text-foreground/90"
            >
              <span className="font-mono text-[10px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground">
          what you can do in the lab
        </div>
        <ul className="space-y-2">
          {project.interactions.map((line, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border-subtle bg-surface-1/40 px-4 py-3 text-[14px] text-muted-foreground"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border-subtle bg-surface-1/60 px-6 py-5">
        <div>
          <div className="text-[15px] font-medium">
            {completed ? "Ready to run this system live?" : "Want to see it the moment it lands?"}
          </div>
          <div className="mt-0.5 text-[13px] text-muted-foreground">
            {completed
              ? "Sign in once with Google and open it in the lab."
              : "The architecture preview is interactive in the lab today."}
          </div>
        </div>
        <Link
          to={"/lab/$slug" as any}
          params={{ slug: project.slug } as any}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:opacity-90"
        >
          {completed ? "Open in lab" : "Open preview"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
