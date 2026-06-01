import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card/50 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon className="h-7 w-7" size={28} />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {subtitle && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}