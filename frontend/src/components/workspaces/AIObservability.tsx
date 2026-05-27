import { motion } from "framer-motion";
import { Panel, PanelHeader, PanelTitle } from "@/components/surfaces/Panel";
import { MetricTile } from "@/components/surfaces/MetricTile";

const spans = [
  { name: "agent.run", offset: 0, width: 100, kind: "root" },
  { name: "planner.propose", offset: 2, width: 18, kind: "llm" },
  { name: "tool.web_search", offset: 22, width: 12, kind: "tool" },
  { name: "tool.web_fetch", offset: 35, width: 22, kind: "tool" },
  { name: "tool.web_fetch", offset: 36, width: 18, kind: "tool" },
  { name: "executor.synthesize", offset: 58, width: 28, kind: "llm" },
  { name: "critic.score", offset: 88, width: 8, kind: "llm" },
];

const colors: Record<string, string> = {
  root: "bg-surface-3",
  llm: "bg-accent/60",
  tool: "bg-status-planned/60",
};

const facets = [
  { label: "Model", items: ["gpt-5", "gpt-5-mini", "gemini-2.5-pro"] },
  { label: "Status", items: ["success", "error"] },
  { label: "Tool", items: ["web.search", "web.fetch", "code.run"] },
];

export function ObservabilityPreview() {
  return (
    <div className="h-full overflow-auto scrollbar-thin p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricTile label="Runs · 24h" value="1,284" hint="+12%" />
        <MetricTile label="P95 latency" value="4.8s" hint="-180ms" />
        <MetricTile label="Error rate" value="0.6%" hint="3 fails" />
        <MetricTile label="Token cost" value="$42.18" hint="24h" />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_240px]">
        <Panel>
          <PanelHeader>
            <PanelTitle>trace · run_8f3a · agent.run</PanelTitle>
            <span className="font-mono text-[10px] text-muted-foreground">duration · 4.82s</span>
          </PanelHeader>
          <div className="p-3 font-mono text-[11px]">
            {spans.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 px-2 py-1.5 hover:bg-surface-2/50 rounded"
              >
                <div className="w-44 truncate text-foreground" style={{ paddingLeft: s.kind === "root" ? 0 : 12 }}>
                  {s.name}
                </div>
                <div className="relative h-3 flex-1 rounded bg-surface-2">
                  <div
                    className={`absolute h-full rounded ${colors[s.kind]}`}
                    style={{ left: `${s.offset}%`, width: `${s.width}%` }}
                  />
                </div>
                <div className="w-16 text-right text-muted-foreground tabular-nums">
                  {(s.width * 48).toFixed(0)}ms
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-border-subtle p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Recent runs</div>
            <div className="mt-3 grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-x-4 gap-y-2 font-mono text-[11.5px]">
              {[
                ["run_8f3a", "Compare vector DB consistency", "4.8s", "$0.024", "ok"],
                ["run_8f2c", "Survey tool-use benchmarks 2025", "8.1s", "$0.062", "ok"],
                ["run_8e91", "Cost analysis of multi-agent loops", "5.4s", "$0.041", "ok"],
                ["run_8d40", "RAG vs long-context tradeoffs", "—", "—", "err"],
              ].map(([id, title, d, c, s]) => (
                <>
                  <span key={`${id}-id`} className="text-muted-foreground">{id}</span>
                  <span key={`${id}-t`} className="truncate text-foreground">{title}</span>
                  <span key={`${id}-d`} className="tabular-nums text-muted-foreground">{d}</span>
                  <span key={`${id}-c`} className="tabular-nums text-muted-foreground">{c}</span>
                  <span key={`${id}-s`} className={s === "ok" ? "text-status-live" : "text-status-error"}>{s}</span>
                </>
              ))}
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader><PanelTitle>Filters</PanelTitle></PanelHeader>
          <div className="space-y-4 p-3 text-[12px]">
            {facets.map((f) => (
              <div key={f.label}>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{f.label}</div>
                <div className="mt-2 space-y-1">
                  {f.items.map((it) => (
                    <label key={it} className="flex items-center gap-2 cursor-pointer">
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded border border-border-strong bg-surface-2">
                        <span className="h-1.5 w-1.5 rounded-sm bg-accent opacity-0 transition-opacity" />
                      </span>
                      <span className="text-foreground">{it}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
