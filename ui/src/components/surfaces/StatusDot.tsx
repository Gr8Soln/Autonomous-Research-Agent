import { cn } from "@/lib/utils";

const colorMap = {
  live: "bg-status-live shadow-[0_0_8px_0_var(--status-live)]",
  planned: "bg-status-planned",
  idle: "bg-status-idle",
  error: "bg-status-error",
} as const;

export function StatusDot({
  status,
  className,
  pulse = false,
}: {
  status: keyof typeof colorMap;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span className={cn("relative inline-flex h-1.5 w-1.5", className)}>
      {pulse && (
        <span
          className={cn(
            "absolute inset-0 animate-ping rounded-full opacity-60",
            colorMap[status],
          )}
        />
      )}
      <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", colorMap[status])} />
    </span>
  );
}
