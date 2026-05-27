import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { AuthBackdrop } from "@/components/auth/AuthBackdrop";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-border-subtle">
      <AuthBackdrop />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-1/60 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-status-live" />
          continuous engineering · v0.4.1
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-6 max-w-[920px] text-[44px] font-semibold leading-[1.05] tracking-tight md:text-[64px]"
        >
          A working lab of{" "}
          <span className="bg-gradient-to-br from-foreground to-accent bg-clip-text text-transparent">
            autonomous AI systems
          </span>
          .
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-5 max-w-[680px] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]"
        >
          A growing collection of practical AI engineering projects — read the
          architecture, then run the system. Built, explained, and exposed
          interactively for engineers, recruiters, and learners.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Link
            to={"/systems" as any}
            className="group inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Explore systems
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border-strong bg-surface-1/70 px-5 text-sm font-medium text-foreground backdrop-blur transition hover:bg-surface-2"
          >
            <Terminal className="h-4 w-4" />
            Open the lab
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-14 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-border-subtle bg-border-subtle"
        >
          {[
            ["Read", "architecture + loop"],
            ["Understand", "trace + reasoning"],
            ["Test live", "in the lab"],
          ].map(([label, hint]) => (
            <div key={label} className="bg-surface-1/70 px-5 py-4 backdrop-blur">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {hint}
              </div>
              <div className="mt-1 text-[15px] font-medium tracking-tight">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
