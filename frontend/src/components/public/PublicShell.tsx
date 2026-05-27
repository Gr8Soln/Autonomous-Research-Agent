import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { useSession } from "@/lib/use-session";
import { cn } from "@/lib/utils";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicNav />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

function PublicNav() {
  const { session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between px-6 md:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded border border-border-strong bg-surface-2">
            <div className="h-2 w-2 rotate-45 rounded-[1px] bg-gradient-to-br from-accent to-accent/40" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground">
            autonomous-ai-systems
          </span>
        </Link>

        <nav className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em]">
          <NavItem to={"/systems" as any}>Systems</NavItem>
          <NavItem to={(session ? "/lab" : "/login") as any}>Lab</NavItem>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="hidden h-8 items-center gap-1.5 rounded-md px-3 text-muted-foreground transition hover:text-foreground sm:inline-flex"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
          <Link
            to={(session ? "/lab" : "/login") as any}
            className="ml-2 inline-flex h-8 items-center rounded-md border border-border-strong bg-surface-2 px-3 text-foreground transition hover:bg-surface-3"
          >
            {session ? "Open lab" : "Sign in"}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to as any}
      className={cn(
        "inline-flex h-8 items-center rounded-md px-3 text-muted-foreground transition hover:text-foreground",
      )}
      activeProps={{ className: "text-foreground" }}
    >
      {children}
    </Link>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-border-subtle bg-surface-1/40">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-6 py-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10">
        <div>autonomous-ai-systems · engineering lab</div>
        <div className="flex items-center gap-4">
          <span>build 0.4.1</span>
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:text-foreground">
            github
          </a>
          <Link to={"/systems" as any} className="hover:text-foreground">systems</Link>
        </div>
      </div>
    </footer>
  );
}
