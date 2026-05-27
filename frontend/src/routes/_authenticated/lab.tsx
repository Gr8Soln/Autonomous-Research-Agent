import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/project/ProjectCard";
import { MetricTile } from "@/components/surfaces/MetricTile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/lab")({
  head: () => ({
    meta: [
      { title: "Lab — autonomous-ai-systems" },
      { name: "description", content: "Live experimentation workspace for autonomous AI systems." },
    ],
  }),
  component: LabPage,
});

type Filter = "all" | "completed" | "planned";

function LabPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (filter !== "all" && p.status !== filter) return false;
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.capabilities.some((c) => c.toLowerCase().includes(q))
        );
      }),
    [filter, query],
  );

  const total = projects.length;
  const live = projects.filter((p) => p.status === "completed").length;
  const planned = total - live;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          autonomous-ai-systems / lab
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Lab</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Live experimentation workspace. Every system here runs against a real
          backend — outputs may vary between runs. Pick a system to open its
          workspace.
        </p>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricTile label="Total systems" value={total} />
        <MetricTile label="Live" value={live} hint="completed" />
        <MetricTile label="Planned" value={planned} hint="in design" />
        <MetricTile label="Runs · 24h" value="—" hint="awaiting telemetry" />
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex h-9 rounded-lg border border-border-subtle bg-surface-1 p-0.5 text-[12px]">
          {(["all", "completed", "planned"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-3 font-mono text-[11px] uppercase tracking-wider transition",
                filter === f
                  ? "bg-surface-3 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search systems, capabilities…"
            className="h-9 w-full rounded-lg border border-border-subtle bg-surface-1 pl-8 pr-3 text-[13px] outline-none placeholder:text-muted-foreground/70 focus:border-border-strong sm:w-72"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border-subtle bg-surface-1 px-6 py-12 text-center text-sm text-muted-foreground">
            No systems match your filter.
          </div>
        )}
      </div>
    </div>
  );
}
