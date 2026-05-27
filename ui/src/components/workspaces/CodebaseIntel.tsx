import { useState } from "react";
import { Group as PanelGroup, Panel as RPanel, Separator as PanelResizeHandle } from "react-resizable-panels";
import { ChevronRight, ChevronDown, FileCode2, Folder, FolderOpen, Search, Sparkles } from "lucide-react";
import { Panel, PanelHeader, PanelTitle } from "@/components/surfaces/Panel";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

type Node = { name: string; kind: "dir" | "file"; children?: Node[]; lang?: string };

const tree: Node[] = [
  {
    name: "src", kind: "dir", children: [
      { name: "agents", kind: "dir", children: [
        { name: "planner.ts", kind: "file", lang: "typescript" },
        { name: "critic.ts", kind: "file", lang: "typescript" },
        { name: "executor.ts", kind: "file", lang: "typescript" },
      ]},
      { name: "graph", kind: "dir", children: [
        { name: "builder.ts", kind: "file", lang: "typescript" },
        { name: "traversal.ts", kind: "file", lang: "typescript" },
      ]},
      { name: "index.ts", kind: "file", lang: "typescript" },
    ],
  },
  { name: "package.json", kind: "file", lang: "json" },
  { name: "README.md", kind: "file", lang: "markdown" },
];

const sampleCode = `import { Planner } from "./agents/planner";
import { Critic } from "./agents/critic";
import { Executor } from "./agents/executor";

// Self-correcting research loop:
// propose -> critique -> revise -> until verified
export async function run(task: string) {
  const planner = new Planner();
  const critic = new Critic({ threshold: 0.82 });
  const executor = new Executor();

  let plan = await planner.propose(task);
  for (let i = 0; i < 5; i++) {
    const result = await executor.run(plan);
    const score = await critic.score(result);
    if (score >= 0.82) return result;
    plan = await planner.revise(plan, critic.feedback);
  }
  throw new Error("Did not converge");
}
`;

export function CodebaseIntelWorkspace() {
  const [selected, setSelected] = useState("src/agents/planner.ts");

  return (
    <div className="h-full p-3">
      <PanelGroup orientation="horizontal" className="h-full">
        <RPanel defaultSize={22} minSize={16}>
          <Panel className="flex h-full flex-col">
            <PanelHeader>
              <PanelTitle>repo · autonomous-ai-systems</PanelTitle>
            </PanelHeader>
            <div className="border-b border-border-subtle p-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Find file…"
                  className="h-7 w-full rounded-md border border-border-subtle bg-surface-2 pl-7 pr-2 font-mono text-[11px] outline-none focus:border-border-strong"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-1.5 font-mono text-[12px]">
              <Tree nodes={tree} path="" selected={selected} onSelect={setSelected} />
            </div>
          </Panel>
        </RPanel>

        <PanelResizeHandle className="w-2" />

        <RPanel defaultSize={48} minSize={30}>
          <Panel className="flex h-full flex-col">
            <PanelHeader>
              <div className="flex items-center gap-2">
                <FileCode2 className="h-3 w-3 text-accent" />
                <PanelTitle>{selected}</PanelTitle>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">main · TS</span>
            </PanelHeader>
            <div className="flex-1 overflow-auto scrollbar-thin">
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "16px 20px",
                  background: "transparent",
                  fontSize: 12.5,
                  fontFamily: "var(--font-mono)",
                }}
                showLineNumbers
                lineNumberStyle={{ color: "oklch(0.5 0 0)", fontSize: 11 }}
              >
                {sampleCode}
              </SyntaxHighlighter>
            </div>
          </Panel>
        </RPanel>

        <PanelResizeHandle className="w-2" />

        <RPanel defaultSize={30} minSize={22}>
          <Panel className="flex h-full flex-col">
            <PanelHeader>
              <PanelTitle>AI insights</PanelTitle>
              <Sparkles className="h-3 w-3 text-accent" />
            </PanelHeader>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Semantic Q&A</div>
              <div className="mt-2 rounded-md border border-border-subtle bg-surface-2/50 p-3">
                <div className="text-[12.5px] font-medium">How does the critic loop terminate?</div>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                  The loop terminates when{" "}
                  <code className="rounded bg-surface-3 px-1 font-mono text-[11px]">score &gt;= 0.82</code>{" "}
                  or after 5 iterations, throwing{" "}
                  <code className="rounded bg-surface-3 px-1 font-mono text-[11px]">"Did not converge"</code>.
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Ref>planner.ts:14</Ref>
                  <Ref>critic.ts:9</Ref>
                </div>
              </div>

              <div className="mt-6 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Architecture map</div>
              <div className="mt-2 space-y-1.5 text-[12px]">
                <Arch label="agents/" hint="3 modules" />
                <Arch label="graph/" hint="2 modules" />
                <Arch label="index.ts" hint="entrypoint · 1 export" />
              </div>

              <div className="mt-6 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Symbols in file</div>
              <div className="mt-2 space-y-1 font-mono text-[11.5px]">
                <Sym>class Planner</Sym>
                <Sym>fn propose(task)</Sym>
                <Sym>fn revise(plan, feedback)</Sym>
              </div>
            </div>
          </Panel>
        </RPanel>
      </PanelGroup>
    </div>
  );
}

function Sym({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded px-2 py-1 hover:bg-surface-2">
      <span className="h-1 w-1 rounded-full bg-accent" />
      <span>{children}</span>
    </div>
  );
}

function Arch({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-2/40 px-3 py-1.5">
      <span className="font-mono">{label}</span>
      <span className="font-mono text-[10.5px] text-muted-foreground">{hint}</span>
    </div>
  );
}

function Ref({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-border-subtle bg-surface-3 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      {children}
    </span>
  );
}

function Tree({
  nodes, path, selected, onSelect, depth = 0,
}: { nodes: Node[]; path: string; selected: string; onSelect: (p: string) => void; depth?: number }) {
  return (
    <div>
      {nodes.map((n) => (
        <TreeRow key={n.name} node={n} path={path} selected={selected} onSelect={onSelect} depth={depth} />
      ))}
    </div>
  );
}

function TreeRow({
  node, path, selected, onSelect, depth,
}: { node: Node; path: string; selected: string; onSelect: (p: string) => void; depth: number }) {
  const [open, setOpen] = useState(true);
  const full = path ? `${path}/${node.name}` : node.name;
  const isSel = selected === full;
  if (node.kind === "dir") {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-1 rounded px-1 py-0.5 text-left hover:bg-surface-2"
          style={{ paddingLeft: depth * 10 + 4 }}
        >
          {open ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          {open ? <FolderOpen className="h-3 w-3 text-accent" /> : <Folder className="h-3 w-3 text-muted-foreground" />}
          <span className="text-foreground">{node.name}</span>
        </button>
        {open && node.children && (
          <Tree nodes={node.children} path={full} selected={selected} onSelect={onSelect} depth={depth + 1} />
        )}
      </div>
    );
  }
  return (
    <button
      onClick={() => onSelect(full)}
      className={cn(
        "flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-left",
        isSel ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:bg-surface-2/50 hover:text-foreground",
      )}
      style={{ paddingLeft: depth * 10 + 16 }}
    >
      <FileCode2 className="h-3 w-3" />
      <span>{node.name}</span>
    </button>
  );
}
