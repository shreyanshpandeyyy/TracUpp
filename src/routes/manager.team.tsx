import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEmployees, useTasks } from "@/lib/tracup/store";
import { statsForEmployee } from "@/lib/tracup/stats";
import { formatDuration, initials } from "@/lib/tracup/format";
import { PriorityBadge } from "@/components/tracup/PriorityBadge";
import { ProgressRing } from "@/components/tracup/ProgressRing";
import type { Employee } from "@/lib/tracup/types";

export const Route = createFileRoute("/manager/team")({
  component: Team,
});

function Team() {
  const employees = useEmployees();
  const tasks = useTasks();
  const [selected, setSelected] = useState<Employee | null>(null);

  const cards = useMemo(
    () => employees.map((e) => statsForEmployee(e, tasks)),
    [employees, tasks],
  );

  const detail = useMemo(() => {
    if (!selected) return null;
    const list = tasks.filter((t) => t.employeeId === selected.id);
    return { stats: statsForEmployee(selected, tasks), list };
  }, [selected, tasks]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">My Team</h1>
        <p className="mt-1 text-muted-foreground">Tap a teammate to see their tasks and progress.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((s) => (
          <button
            key={s.employee.id}
            onClick={() => setSelected(s.employee)}
            className="hover-lift rounded-lg border bg-card p-5 text-left shadow-card"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
                {initials(s.employee.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{s.employee.name}</p>
                <p className="truncate text-sm text-muted-foreground">{s.employee.role}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 font-semibold text-accent">
                {s.activeCount} active
              </span>
              <span className="text-muted-foreground">{s.completed}/{s.total} done</span>
            </div>
          </button>
        ))}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {detail && selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
                    {initials(selected.name)}
                  </span>
                  <div className="text-left">
                    <p className="font-semibold">{selected.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{selected.role}</p>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex items-center gap-5 rounded-lg border bg-secondary/40 p-5">
                <ProgressRing value={detail.stats.completed} total={detail.stats.total} />
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">{detail.stats.total}</span> total tasks</p>
                  <p><span className="font-semibold text-success">{detail.stats.completed}</span> completed</p>
                  <p><span className="font-semibold text-accent">{detail.stats.ongoing}</span> ongoing</p>
                  <p className="font-mono text-xs text-muted-foreground">{formatDuration(detail.stats.totalSeconds)} tracked</p>
                </div>
              </div>

              <h3 className="mt-6 mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Tasks</h3>
              <div className="space-y-3">
                {detail.list.map((t) => (
                  <div key={t.id} className="rounded-md border bg-card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${t.status === "completed" ? "line-through opacity-70" : ""}`}>
                        {t.title}
                      </p>
                      <PriorityBadge priority={t.priority} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize">{t.status}</span>
                      <span className="font-mono">{formatDuration(t.timeSpentSeconds)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}