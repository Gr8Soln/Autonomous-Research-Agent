import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Command, LogOut, Menu, User } from "lucide-react";
import { useAppSidebar } from "./AppShell";
import { useSession } from "@/lib/use-session";
import { supabase } from "@/integrations/supabase/client";
import { projectBySlug } from "@/lib/projects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommandPalette } from "@/components/layout/CommandPalette";

export function Topbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { session } = useSession();
  const palette = useCommandPalette();
  const sidebar = useAppSidebar();

  const crumbs = pathname.split("/").filter(Boolean);
  const slug = crumbs[0] === "lab" ? crumbs[1] : null;
  const project = slug ? projectBySlug(slug) : null;

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-subtle bg-surface-1/60 px-3 backdrop-blur md:px-4">
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
        <button
          onClick={sidebar.toggle}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border-subtle bg-surface-2 text-muted-foreground transition hover:border-border-strong hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-3.5 w-3.5" />
        </button>
        <Link to="/lab" className="hover:text-foreground">lab</Link>
        {crumbs[0] === "lab" && slug && (
          <>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{project?.name ?? slug}</span>
          </>
        )}
        {crumbs[0] === "settings" && (
          <>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">settings</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1 rounded border border-border-subtle bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:inline-flex">
          <span className="h-1 w-1 rounded-full bg-status-live" />
          env · local
        </span>

        <button
          onClick={() => palette.setOpen(true)}
          className="flex h-7 items-center gap-2 rounded-md border border-border-subtle bg-surface-2 px-2 font-mono text-[11px] text-muted-foreground transition hover:border-border-strong hover:text-foreground"
        >
          <Command className="h-3 w-3" />
          <span>K</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-md border border-border-subtle bg-surface-2 transition hover:border-border-strong">
            {session?.user.user_metadata?.avatar_url ? (
              <img
                src={session.user.user_metadata.avatar_url}
                alt=""
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <User className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="text-sm font-medium">
                {session?.user.user_metadata?.full_name ?? "Operator"}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground truncate">
                {session?.user.email}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => supabase.auth.signOut()}>
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
