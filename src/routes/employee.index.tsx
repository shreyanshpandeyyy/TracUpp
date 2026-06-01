import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ListTodo, Loader, CheckCircle2, Inbox, CalendarClock } from "lucide-react";
import { useTasks } from "@/lib/tracup/store";
import { useSession } from "@/lib/tracup/useSession";
import { greeting } from "@/lib/tracup/format";
import { StatCard } from "@/components/tracup/StatCard";
import { TaskCard } from "@/components/tracup/TaskCard";
import { EmptyState } from "@/components/tracup/EmptyState";
import { CalendarStrip, todayISO } from "@/components/tracup/CalendarStrip";
import { CURRENT_EMPLOYEE_ID } from "@/lib/tracup/seed";

export const Route = createFileRoute("/employee/")({
  component: EmployeeHome,
});

function EmployeeHome() {
  const session = useSession();
  const allTasks = useTasks();
  const [selected, setSelected] = useState<string | null>(todayISO());

  const myTasks = useMemo(
    () => allTasks.filter((t) => t.employeeId === CURRENT_EMPLOYEE_ID),
    [allTasks],
  );

  const stats = useMemo(() => {
    const ongoing = myTasks.filter((t) => t.status === "ongoing" && t.source === "self");
    const completed = myTasks.filter((t) => t.status === "completed");
    const assigned = myTasks.filter((t) => t.source === "manager");
    return { total: myTasks.length, ongoing: ongoing.length, completed: completed.length, assigned: assigned.length };
  }, [myTasks]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of myTasks) {
      const key = t.status === "completed" ? (t.completedDate ?? t.dueDate) : t.dueDate;
      c[key] = (c[key] ?? 0) + 1;
    }
    return c;
  }, [myTasks]);

  const filtered = useMemo(() => {
    if (!selected) return myTasks;
    return myTasks.filter((t) => {
      const key = t.status === "completed" ? (t.completedDate ?? t.dueDate) : t.dueDate;
      return key === selected || t.createdDate === selected;
    });
  }, [myTasks, selected]);

  const firstName = session?.name.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting()}, {firstName}
        </h1>
        <p className="mt-1 text-muted-foreground">Here's what's on your plate today.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Tasks" value={stats.total} icon={ListTodo} tint="primary" />
        <StatCard label="Ongoing" value={stats.ongoing} icon={Loader} tint="accent" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tint="success" />
        <StatCard label="Assigned by Manager" value={stats.assigned} icon={Inbox} tint="destructive" />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">This week</h2>
          {selected && (
            <button
              onClick={() => setSelected(null)}
              className="text-sm font-medium text-accent hover:underline"
            >
              Show all
            </button>
          )}
        </div>
        <CalendarStrip selected={selected} onSelect={setSelected} counts={counts} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          {selected ? "Tasks for selected day" : "All tasks"}
        </h2>
        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nothing scheduled"
            subtitle="No tasks for this day. Pick another date or add a new task."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                variant={t.status === "completed" ? "completed" : t.source === "manager" ? "assigned" : "plain"}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}