import { cn } from "@/lib/utils";

function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday = 0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function weekDays(ref = new Date()): string[] {
  const start = startOfWeek(ref);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function CalendarStrip({
  selected,
  onSelect,
  counts,
}: {
  selected: string | null;
  onSelect: (iso: string | null) => void;
  counts: Record<string, number>;
}) {
  const days = weekDays();
  const today = todayISO();
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {days.map((iso, i) => {
        const isToday = iso === today;
        const isActive = selected === iso;
        const count = counts[iso] ?? 0;
        const dayNum = new Date(iso + "T00:00:00").getDate();
        return (
          <button
            key={iso}
            onClick={() => onSelect(isActive ? null : iso)}
            className={cn(
              "relative flex min-w-[64px] flex-col items-center gap-0.5 rounded-lg border px-3 py-3 transition",
              isActive
                ? "border-accent bg-accent text-accent-foreground shadow-card"
                : "bg-card hover:border-accent/50 hover:shadow-card",
            )}
          >
            <span className={cn("text-[11px] font-medium uppercase tracking-wide", !isActive && "text-muted-foreground")}>
              {labels[i]}
            </span>
            <span className="text-lg font-bold">{dayNum}</span>
            {count > 0 && (
              <span
                className={cn(
                  "absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full",
                  isActive ? "bg-accent-foreground" : "bg-accent",
                )}
              />
            )}
            {isToday && !isActive && (
              <span className="text-[9px] font-semibold uppercase text-accent">Today</span>
            )}
          </button>
        );
      })}
    </div>
  );
}