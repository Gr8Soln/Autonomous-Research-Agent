import { motion } from "framer-motion";

const nodes = [
  { id: "input", label: "Input", x: 60 },
  { id: "planner", label: "Planner", x: 200 },
  { id: "tools", label: "Tool loop", x: 360 },
  { id: "critic", label: "Critic", x: 520 },
  { id: "output", label: "Output", x: 680 },
];

export function ArchitectureDiagram() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border-subtle bg-surface-1/60 p-6">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="relative">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          generic system loop
        </div>
        <svg viewBox="0 0 780 200" className="w-full">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="oklch(0.78 0.13 200 / 0.7)" />
            </marker>
          </defs>

          {nodes.slice(0, -1).map((n, i) => {
            const next = nodes[i + 1];
            return (
              <motion.line
                key={n.id}
                x1={n.x + 60}
                y1={100}
                x2={next.x - 4}
                y2={100}
                stroke="oklch(0.78 0.13 200 / 0.5)"
                strokeWidth={1.2}
                strokeDasharray="4 4"
                markerEnd="url(#arrow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.6 }}
              />
            );
          })}

          <motion.path
            d="M 420 130 C 420 170, 280 170, 280 130"
            fill="none"
            stroke="oklch(0.78 0.14 75 / 0.55)"
            strokeWidth={1.2}
            strokeDasharray="3 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            markerEnd="url(#arrow)"
          />
          <text x="350" y="180" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: 1.5, textTransform: "uppercase" }}>
            revise
          </text>

          {nodes.map((n, i) => (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <rect
                x={n.x}
                y={80}
                width={120}
                height={40}
                rx={8}
                fill="oklch(0.215 0.008 260)"
                stroke="oklch(1 0 0 / 0.14)"
                strokeWidth={1}
              />
              <text
                x={n.x + 60}
                y={104}
                textAnchor="middle"
                className="fill-foreground"
                style={{ fontSize: 12, fontFamily: "var(--font-sans)", fontWeight: 500 }}
              >
                {n.label}
              </text>
            </motion.g>
          ))}
        </svg>
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          <span>query in</span>
          <span>trace captured</span>
        </div>
      </div>
    </div>
  );
}
