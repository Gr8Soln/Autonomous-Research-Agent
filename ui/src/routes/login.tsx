import { createFileRoute, Navigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AuthBackdrop } from "@/components/auth/AuthBackdrop";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useSession } from "@/lib/use-session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Autonomous AI Systems" },
      { name: "description", content: "Access the autonomous AI systems workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { session, loading } = useSession();
  if (!loading && session) return <Navigate to={"/lab" as any} />;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <AuthBackdrop />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] rounded-2xl border border-border-strong bg-surface-1/70 p-8 shadow-overlay backdrop-blur-xl"
      >
        <div className="flex items-center gap-2.5">
          <Monogram />
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            autonomous-ai-systems
          </div>
        </div>

        <h1 className="mt-8 text-[26px] font-semibold leading-tight tracking-tight">
          A runtime for<br />autonomous agents.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          An engineering workspace for testing, orchestrating, and observing
          autonomous AI systems.
        </p>

        <div className="mt-8">
          <GoogleSignInButton />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>v0.4.1</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-status-live" />
            runtime ready
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function Monogram() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border-strong bg-surface-2">
      <div className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-gradient-to-br from-accent to-accent/40" />
    </div>
  );
}
