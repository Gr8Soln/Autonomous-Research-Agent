import { Link, useRouterState } from "@tanstack/react-router";
import { Boxes, LayoutGrid, Settings, Workflow, BookOpenText, Search, GitBranch, Activity, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/projects";
import { useAppSidebar } from "./AppShell";

const slugIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "research-agent": BookOpenText,
  "codebase-intelligence": Search,
  "self-correcting-agent": Workflow,
  "workflow-orchestrator": GitBranch,
  "ai-observability": Activity,
};

export function SidebarNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isMobile, collapsed, setMobileOpen } = useAppSidebar();
  const isIconOnly = !isMobile && collapsed;
  const closeOnNav = () => isMobile && setMobileOpen(false);

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-border-subtle bg-surface-1 transition-[width] duration-200",
        isIconOnly ? "w-[56px]" : "w-[220px]",
      )}
    >
      <div className="flex h-12 items-center gap-2 border-b border-border-subtle px-4">
        <Link to="/" className="flex h-6 w-6 items-center justify-center rounded border border-border-strong bg-surface-2">
          <div className="h-2 w-2 rotate-45 rounded-[1px] bg-gradient-to-br from-accent to-accent/40" />
        </Link>
        {!isIconOnly && (
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-foreground">
            aas.lab
          </span>
        )}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
        <NavSection label="Hub" iconOnly={isIconOnly}>
          <NavLink to="/lab" active={pathname === "/lab"} icon={LayoutGrid} iconOnly={isIconOnly} onNavigate={closeOnNav}>
            Lab
          </NavLink>
        </NavSection>

        <NavSection label="Systems" iconOnly={isIconOnly}>
          {projects.map((p) => {
            const Icon = slugIcons[p.slug] ?? Boxes;
            const active = pathname === `/lab/${p.slug}`;
            return (
              <NavLink
                key={p.slug}
                to="/lab/$slug"
                params={{ slug: p.slug }}
                active={active}
                icon={Icon}
                dim={p.status === "planned"}
                iconOnly={isIconOnly}
                onNavigate={closeOnNav}
              >
                <span className="truncate">{p.name.replace(" Agent", "")}</span>
              </NavLink>
            );
          })}
        </NavSection>

        <NavSection label="Account" iconOnly={isIconOnly}>
          <NavLink to="/settings" active={pathname === "/settings"} icon={Settings} iconOnly={isIconOnly} onNavigate={closeOnNav}>
            Settings
          </NavLink>
        </NavSection>
      </nav>

      {!isIconOnly && (
        <div className="border-t border-border-subtle px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>build</span>
            <span className="text-foreground/70">{"0.4.1·dev"}</span>
          </div>
        </div>
      )}
    </aside>
  );
}

function NavSection({ label, iconOnly, children }: { label: string; iconOnly?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      {!iconOnly && (
        <div className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          {label}
        </div>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function NavLink({
  to,
  params,
  active,
  icon: Icon,
  dim,
  iconOnly,
  onNavigate,
  children,
}: {
  to: string;
  params?: Record<string, string>;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  dim?: boolean;
  iconOnly?: boolean;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to as any}
      params={params as any}
      onClick={onNavigate}
      title={iconOnly && typeof children === "string" ? children : undefined}
      className={cn(
        "group flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] transition",
        iconOnly && "justify-center px-0",
        active
          ? "bg-surface-2 text-foreground"
          : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
        dim && !active && "text-muted-foreground/60",
      )}
    >
      <Icon className={cn("h-3.5 w-3.5 shrink-0", active ? "text-accent" : "text-muted-foreground")} />
      {!iconOnly && <span className="truncate">{children}</span>}
    </Link>
  );
}
