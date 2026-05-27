import { motion } from "framer-motion";
import { Panel, PanelHeader, PanelTitle } from "@/components/surfaces/Panel";
import { Circle, GitBranch, Boxes, Cpu, ArrowDownToLine, Zap } from "lucide-react";

type N = { id: string; label: string; x: number; y: number; icon: React.ComponentType<{ className?: string }>; kind: string };
const nodes: N[] = [
  { id: "trigger", label: "Trigger", x: 60, y: 200, icon: Zap, kind: "trigger" },
  { id: "agent1", label: "Planner", x: 240, y: 120, icon: Cpu, kind: "agent" },
  { id: "tool1", label: "web.search", x: 240, y: 280, icon: Boxes, kind: "tool" },
  { id: "branch", label: "Branch", x: 440, y: 200, icon: GitBranch, kind: "branch" },
  { id: "agent2", label: "Synthesizer", x: 620, y: 120, icon: Cpu, kind: "agent" },
  { id: "output", label: "Output", x: 800, y: 200, icon: ArrowDownToLine, kind: "output" },
];
const edges: [string, string][] = [
  ["trigger", "agent1"], ["trigger", "tool1"], ["agent1", "branch"], ["tool1", "branch"], ["branch", "agent2"], ["agent2", "output"],
];
const palette = [
  { icon: Zap, label: "Trigger" },
  { icon: Cpu, label: "Agent" },
  { icon: Boxes, label: "Tool" },
  { icon: GitBranch, label: "Branch" },
  { icon: ArrowDownToLine, label: "Output" },
];

export function OrchestratorPreview() {
  return (
    <div className="h-full p-3">
      <div className="grid h-full grid-cols-1 gap-3 md:grid-cols-[200px_1fr]">
        <Panel className="flex h-full flex-col">
          <PanelHeader><PanelTitle>Nodes</PanelTitle></PanelHeader>
          <div className="space-y-1 p-2">
            {palette.map((p) => (
              <div key={p.label} className="flex items-center gap-2 rounded-md border border-border-subtle bg-surface-2/40 px-2.5 py-2 cursor-grab">
                <p.icon className="h-3.5 w-3.5 text-accent" />
                <span className="text-[12.5px]">{p.label}</span>
                <Circle className="ml-auto h-1.5 w-1.5 fill-muted-foreground text-muted-foreground" />
              </div>
            ))}
          </div>
          <div className="mt-auto border-t border-border-subtle p-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            drag nodes onto canvas
          </div>
        </Panel>

        <Panel className="relative overflow-hidden">
          <PanelHeader>
            <PanelTitle>workflow · untitled-dag</PanelTitle>
            <span className="font-mono text-[10px] text-muted-foreground">6 nodes · 6 edges</span>
          </PanelHeader>
          <div className="relative h-[calc(100%-2.5rem)] overflow-auto" style={{
            backgroundImage: "radial-gradient(circle, oklch(1 0 0 / 0.07) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}>
            <svg width="900" height="440" className="absolute inset-0">
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="oklch(1 0 0 / 0.3)" />
                </marker>
              </defs>
              {edges.map(([from, to], i) => {
                const a = nodes.find((n) => n.id === from)!;
                const b = nodes.find((n) => n.id === to)!;
                const midX = (a.x + b.x) / 2;
                return (
                  <motion.path
                    key={`${from}-${to}`}
                    d={`M ${a.x + 70},${a.y} C ${midX},${a.y} ${midX},${b.y} ${b.x},${b.y}`}
                    stroke="oklch(1 0 0 / 0.18)"
                    strokeWidth={1.2}
                    fill="none"
                    markerEnd="url(#arr)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                  />
                );
              })}
            </svg>
            {nodes.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="absolute flex h-[44px] w-[140px] items-center gap-2 rounded-lg border border-border-strong bg-surface-2 px-3 shadow-panel"
                style={{ left: n.x, top: n.y - 22 }}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-3">
                  <n.icon className="h-3.5 w-3.5 text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{n.kind}</div>
                  <div className="truncate text-[12px]">{n.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
