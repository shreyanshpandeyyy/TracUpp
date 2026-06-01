import type { Priority } from "@/lib/tracup/types";
import { cn } from "@/lib/utils";

const styles: Record<Priority, string> = {
  High: "bg-priority-high text-priority-high-foreground",
  Medium: "bg-priority-medium text-priority-medium-foreground",
  Low: "bg-priority-low text-priority-low-foreground",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        styles[priority],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {priority}
    </span>
  );
}