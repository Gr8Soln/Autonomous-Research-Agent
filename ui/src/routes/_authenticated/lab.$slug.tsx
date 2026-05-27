import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { projectBySlug } from "@/lib/projects";
import { StatusDot } from "@/components/surfaces/StatusDot";
import { CapabilityTag } from "@/components/project/CapabilityTag";
import { ResearchAgentWorkspace } from "@/components/workspaces/ResearchAgent";
import { CodebaseIntelWorkspace } from "@/components/workspaces/CodebaseIntel";
import { SelfCorrectingPreview } from "@/components/workspaces/SelfCorrecting";
import { OrchestratorPreview } from "@/components/workspaces/WorkflowOrchestrator";
import { ObservabilityPreview } from "@/components/workspaces/AIObservability";

export const Route = createFileRoute("/_authenticated/lab/$slug")({
  loader: ({ params }) => {
    const project = projectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.project.name ?? "System"} — Lab` },
      { name: "description", content: loaderData?.project.tagline ?? "" },
    ],
  }),
  component: SystemWorkspace,
  notFoundComponent: () => (
    <div className="flex h-full items-center justify-center p-10 text-sm text-muted-foreground">
      System not found.
      <Link to={"/lab" as any} className="ml-2 text-accent">Back to lab</Link>
    </div>
  ),
});

const workspaceMap: Record<string, React.ComponentType> = {
  "research-agent": ResearchAgentWorkspace,
  "codebase-intelligence": CodebaseIntelWorkspace,
  "self-correcting-agent": SelfCorrectingPreview,
  "workflow-orchestrator": OrchestratorPreview,
  "ai-observability": ObservabilityPreview,
};

function SystemWorkspace() {
  const { project } = Route.useLoaderData();
  const Workspace = workspaceMap[project.slug];
  const completed = project.status === "completed";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-border-subtle bg-surface-1/40 px-6 py-4 md:px-8">
        <Link
          to={"/lab" as any}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          lab
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <StatusDot status={completed ? "live" : "planned"} pulse={completed} />
              <h1 className="text-xl font-semibold tracking-tight">{project.name}</h1>
              {project.version && (
                <span className="font-mono text-[10px] text-muted-foreground">
                  {project.version}
                </span>
              )}
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">{project.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.capabilities.map((c: string) => (
              <CapabilityTag key={c}>{c}</CapabilityTag>
            ))}
          </div>
        </div>
      </div>

      {!completed && (
        <div className="shrink-0 border-b border-border-subtle bg-status-planned/[0.06] px-6 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-status-planned">
          Planned system · interactive preview
        </div>
      )}

      <div className="min-h-0 flex-1">{Workspace ? <Workspace /> : null}</div>
    </div>
  );
}
