import { motion } from "framer-motion";
import { Panel, PanelHeader, PanelTitle } from "@/components/surfaces/Panel";

const stages = [
  { id: "propose", label: "Propose", angle: -90 },
  { id: "critique", label: "Critique", angle: 30 },
  { id: "revise", label: "Revise", angle: 150 },
];

const milestones = [
  { label: "Spec", done: true },
  { label: "Critic interface", done: true },
  { label: "Constraint DSL", done: false },
  { label: "Verifier loop", done: false },
  { label: "Eval harness", done: false },
];

export function SelfCorrectingPreview() {
  const R = 110;
  return (
    <div className="h-full overflow-auto scrollbar-thin">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-3 p-4 lg:grid-cols-[1fr_320px]">
        <Panel className="overflow-hidden">
          <PanelHeader>
            <PanelTitle>Self-correction loop</PanelTitle>
            <span className="font-mono text-[10px] text-muted-foreground">propose · critique · revise</span>
          </PanelHeader>
          <div className="relative flex h-[420px] items-center justify-center bg-[radial-gradient(circle_at_center,oklch(1_0_0/0.03),transparent_70%)]">
            <svg width="320" height="320" viewBox="-160 -160 320 320">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="oklch(0.78 0.13 200)" />
                </marker>
              </defs>
              <motion.circle
                r={R} cx={0} cy={0} fill="none"
                stroke="oklch(0.78 0.13 200 / 0.4)" strokeWidth={1.2}
                strokeDasharray="4 6"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              {stages.map((s, i) => {
                const x = Math.cos((s.angle * Math.PI) / 180) * R;
                const y = Math.sin((s.angle * Math.PI) / 180) * R;
                return (
                  <g key={s.id}>
                    <motion.circle
                      cx={x} cy={y} r={26}
                      fill="oklch(0.18 0.008 260)"
                      stroke="oklch(1 0 0 / 0.14)"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    />
                    <text x={x} y={y + 3} textAnchor="middle" fontSize="10" fill="white" fontFamily="var(--font-mono)">
                      {s.label}
                    </text>
                  </g>
                );
              })}
              <motion.circle
                r={4} fill="oklch(0.78 0.13 200)"
                animate={{
                  cx: stages.map((s) => Math.cos((s.angle * Math.PI) / 180) * R).concat([Math.cos((stages[0].angle * Math.PI) / 180) * R]),
                  cy: stages.map((s) => Math.sin((s.angle * Math.PI) / 180) * R).concat([Math.sin((stages[0].angle * Math.PI) / 180) * R]),
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </div>
          <div className="border-t border-border-subtle p-5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Roadmap</div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {milestones.map((m, i) => (
                <div key={m.label} className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${m.done ? "bg-status-live" : "bg-surface-3"}`} />
                  <span className={`text-[12px] ${m.done ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</span>
                  {i < milestones.length - 1 && <div className="h-px w-6 bg-border-subtle" />}
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader><PanelTitle>Architecture spec</PanelTitle></PanelHeader>
          <div className="divide-y divide-border-subtle">
            <KV k="Pattern" v="Critic-in-the-loop" />
            <KV k="Termination" v="score ≥ 0.82" />
            <KV k="Max steps" v="5" />
            <KV k="Critic model" v="gpt-5-mini" />
            <KV k="Executor" v="gpt-5" />
            <KV k="Verifier" v="rule-based + LLM" />
            <KV k="Status" v="In design" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k}</span>
      <span className="font-mono text-[11.5px] text-foreground">{v}</span>
    </div>
  );
}
