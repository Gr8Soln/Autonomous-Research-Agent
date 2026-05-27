import { useState } from "react";
import { motion } from "framer-motion";
import { Group as PanelGroup, Panel as RPanel, Separator as PanelResizeHandle } from "react-resizable-panels";
import { Plus, Play, ChevronRight, Sparkles, Search, FileText, Globe } from "lucide-react";
import { Panel, PanelHeader, PanelTitle } from "@/components/surfaces/Panel";
import { StatusDot } from "@/components/surfaces/StatusDot";
import { cn } from "@/lib/utils";

const sessions = [
  { id: "rs_8f3a", title: "Compare vector DB consistency models", status: "live", t: "2m ago" },
  { id: "rs_8f2c", title: "Survey: tool-use benchmarks 2025", status: "idle", t: "1h ago" },
  { id: "rs_8e91", title: "Cost analysis of multi-agent loops", status: "idle", t: "yesterday" },
  { id: "rs_8d40", title: "RAG vs long-context tradeoffs", status: "error", t: "2d ago" },
];

const trace = [
  { kind: "plan", title: "Decompose into 4 sub-questions", detail: "Coverage, latency, consistency, cost", icon: Sparkles },
  { kind: "search", title: "web.search", detail: "vector database consistency CAP guarantees 2025", icon: Search },
  { kind: "fetch", title: "web.fetch · pinecone.io/learn/consistency", detail: "200 OK · 41kb", icon: Globe },
  { kind: "fetch", title: "web.fetch · weaviate.io/docs/consistency", detail: "200 OK · 28kb", icon: Globe },
  { kind: "think", title: "Synthesis: eventual vs strong tradeoff", detail: "3 sources cross-checked", icon: Sparkles },
  { kind: "write", title: "report.draft", detail: "1,284 tokens", icon: FileText },
];

export function ResearchAgentWorkspace() {
  const [selected, setSelected] = useState(sessions[0].id);
  const session = sessions.find((s) => s.id === selected)!;

  return (
    <div className="h-full p-3">
      <PanelGroup orientation="horizontal" className="h-full">
        <RPanel defaultSize={20} minSize={15}>
          <Panel className="flex h-full flex-col">
            <PanelHeader>
              <PanelTitle>Sessions</PanelTitle>
              <button className="flex h-6 w-6 items-center justify-center rounded-md border border-border-subtle hover:bg-surface-2">
                <Plus className="h-3 w-3" />
              </button>
            </PanelHeader>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-1.5">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={cn(
                    "block w-full rounded-md px-2.5 py-2 text-left transition",
                    selected === s.id ? "bg-surface-2" : "hover:bg-surface-2/50",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <StatusDot status={s.status as any} pulse={s.status === "live"} />
                    <span className="font-mono text-[10px] text-muted-foreground">{s.id}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">{s.t}</span>
                  </div>
                  <div className="mt-1 line-clamp-2 text-[12.5px] text-foreground">{s.title}</div>
                </button>
              ))}
            </div>
          </Panel>
        </RPanel>

        <PanelResizeHandle className="w-2" />

        <RPanel defaultSize={50} minSize={30}>
          <Panel className="flex h-full flex-col">
            <PanelHeader>
              <div className="flex items-center gap-2">
                <PanelTitle>Reasoning trace</PanelTitle>
                <span className="font-mono text-[10px] text-foreground">/ {session.id}</span>
              </div>
              <button className="inline-flex h-6 items-center gap-1 rounded-md bg-accent px-2 text-[11px] font-medium text-accent-foreground hover:opacity-90">
                <Play className="h-2.5 w-2.5 fill-current" /> Run
              </button>
            </PanelHeader>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
              <div className="mb-4 rounded-md border border-border-subtle bg-surface-2/40 px-3 py-2.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Prompt</div>
                <div className="mt-1 text-[13px]">{session.title}</div>
              </div>
              <div className="relative space-y-2">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border-subtle" />
                {trace.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative flex gap-3"
                  >
                    <div className="relative z-10 mt-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border border-border-strong bg-surface-2">
                      <step.icon className="h-3 w-3 text-accent" />
                    </div>
                    <div className="flex-1 rounded-md border border-border-subtle bg-surface-1 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{step.kind}</span>
                        <span className="text-[12.5px] font-medium">{step.title}</span>
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{step.detail}</div>
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative flex gap-3"
                >
                  <div className="relative z-10 mt-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border border-accent/50 bg-accent-soft">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  </div>
                  <div className="flex-1 py-2 font-mono text-[11px] text-muted-foreground">
                    streaming · 142 tok/s
                  </div>
                </motion.div>
              </div>
            </div>
          </Panel>
        </RPanel>

        <PanelResizeHandle className="w-2" />

        <RPanel defaultSize={30} minSize={20}>
          <Panel className="flex h-full flex-col">
            <PanelHeader>
              <PanelTitle>Report</PanelTitle>
              <span className="font-mono text-[10px] text-muted-foreground">draft</span>
            </PanelHeader>
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
              <div className="prose-sm prose-invert max-w-none">
                <h3 className="text-[15px] font-semibold tracking-tight">
                  Consistency models in modern vector databases
                </h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                  Production vector stores have converged on two dominant
                  strategies: <span className="text-foreground">eventual consistency</span> with
                  asynchronous replication, and{" "}
                  <span className="text-foreground">tunable strong reads</span> at the cost of
                  write latency.
                </p>
                <h4 className="mt-4 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Findings
                </h4>
                <ol className="mt-2 space-y-1.5 text-[12.5px]">
                  <li className="flex gap-2"><ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-accent" /> Pinecone, Weaviate, Qdrant default to eventual.</li>
                  <li className="flex gap-2"><ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-accent" /> Latency penalty for strong reads: 20–60ms p95.</li>
                  <li className="flex gap-2"><ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-accent" /> Hybrid (read-your-writes) is the emerging default.</li>
                </ol>
                <h4 className="mt-4 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Sources
                </h4>
                <ul className="mt-2 space-y-1 font-mono text-[11px] text-muted-foreground">
                  <li>· pinecone.io/learn/consistency</li>
                  <li>· weaviate.io/docs/consistency</li>
                  <li>· qdrant.tech/articles/consistency</li>
                </ul>
              </div>
            </div>
          </Panel>
        </RPanel>
      </PanelGroup>
    </div>
  );
}
