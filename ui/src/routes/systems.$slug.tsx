import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { SystemOverview } from "@/components/public/SystemOverview";
import { projectBySlug } from "@/lib/projects";

export const Route = createFileRoute("/systems/$slug")({
  loader: ({ params }) => {
    const project = projectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.project.name ?? "System"} — autonomous-ai-systems`,
      },
      { name: "description", content: loaderData?.project.tagline ?? "" },
      { property: "og:title", content: loaderData?.project.name ?? "System" },
      { property: "og:description", content: loaderData?.project.tagline ?? "" },
    ],
  }),
  component: SystemPage,
  notFoundComponent: () => (
    <PublicShell>
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">System not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          That slug doesn't match any system in the lab.
        </p>
        <Link
          to={"/systems" as any}
          className="mt-6 inline-flex h-9 items-center rounded-md border border-border-strong bg-surface-2 px-4 text-sm"
        >
          All systems
        </Link>
      </div>
    </PublicShell>
  ),
});

function SystemPage() {
  const { project } = Route.useLoaderData();
  return (
    <PublicShell>
      <SystemOverview project={project} />
    </PublicShell>
  );
}
