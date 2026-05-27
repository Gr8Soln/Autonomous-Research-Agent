import { Panel } from "./Panel";

export function MetricTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Panel className="px-4 py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <div className="text-xl font-semibold tracking-tight tabular-nums">{value}</div>
        {hint && <div className="font-mono text-[10px] text-muted-foreground">{hint}</div>}
      </div>
    </Panel>
  );
}
