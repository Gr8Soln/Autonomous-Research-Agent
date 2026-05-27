import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Panel({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-subtle bg-surface-1 shadow-panel",
        className,
      )}
      {...props}
    />
  );
}

export function PanelHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-10 items-center justify-between border-b border-border-subtle px-3.5",
        className,
      )}
      {...props}
    />
  );
}

export function PanelTitle({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground", className)}
      {...props}
    />
  );
}
