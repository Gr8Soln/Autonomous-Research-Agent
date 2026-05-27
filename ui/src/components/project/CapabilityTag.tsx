import { cn } from "@/lib/utils";

export function CapabilityTag({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded border px-1.5 font-mono text-[10px] uppercase tracking-wider",
        muted
          ? "border-border-subtle text-muted-foreground/70"
          : "border-border-subtle bg-surface-2 text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}
