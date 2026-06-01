import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tint = "accent",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tint?: "accent" | "success" | "primary" | "destructive";
}) {
  const tints: Record<string, string> = {
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    primary: "bg-primary/10 text-primary",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <div className="hover-lift rounded-lg border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-md", tints[tint])}>
          <Icon className="h-4.5 w-4.5" size={18} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}