import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { StatusDot } from "@/components/surfaces/StatusDot";
import { CapabilityTag } from "./CapabilityTag";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const completed = project.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.32, ease: "easeOut" }}
    >
      <Link
        to={"/systems/$slug" as any}
        params={{ slug: project.slug } as any}
        className={cn(
          "group relative block rounded-xl border bg-surface-1 p-5 shadow-panel transition-all duration-200",
          "hover:-translate-y-px hover:border-border-strong hover:bg-surface-2/60",
          completed
            ? "border-border-subtle"
            : "border-dashed border-border-subtle/80",
        )}
      >
        {completed && (
          <span className="absolute left-0 top-5 bottom-5 w-px bg-gradient-to-b from-transparent via-accent/60 to-transparent" />
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <StatusDot status={completed ? "live" : "planned"} pulse={completed} />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {project.category}
            </span>
            {project.version && (
              <span className="font-mono text-[10px] text-muted-foreground/60">
                · {project.version}
              </span>
            )}
          </div>
          {!completed ? (
            <span className="rounded border border-border-subtle bg-surface-2 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-status-planned">
              Planned
            </span>
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          )}
        </div>

        <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{project.name}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.capabilities.map((c) => (
            <CapabilityTag key={c} muted={!completed}>
              {c}
            </CapabilityTag>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
