import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Users, ClipboardList, CheckCircle2, Clock, Activity } from "lucide-react";
import { useEmployees, useTasks } from "@/lib/tracup/store";
import { StatCard } from "@/components/tracup/StatCard";
import { EmptyState } from "@/components/tracup/EmptyState";
import { assignedThisWeek } from "@/lib/tracup/stats";
import { formatDate, formatDuration, initials } from "@/lib/tracup/format";

export const Route = createFileRoute("/manager/")({
  component: ManagerHome,
});

function ManagerHome() {
  const employees = useEmployees();
  const tasks = useTasks();

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "completed");
    const pending = tasks.filter((t) => t.status === "ongoing");
    return {
      team: employees.length,
      assignedWeek: assignedThisWeek(tasks),
      completed: completed.length,
      pending: pending.length,
    };
  }, [employees, tasks]);

  const feed = useMemo(() => {
    return tasks
      .filter((t) => t.status === "completed")
      .sort((a, b) => (b.completedDate ?? "").localeCompare(a.completedDate ?? ""))
      .slice(0, 6)
      .map((t) => ({
        task: t,
        employee: employees.find((e) => e.id === t.employeeId),
      }));
  }, [tasks, employees]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Team overview</h1>
        <p className="mt-1 text-muted-foreground">Track your team's progress at a glance.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Team Members" value={stats.team} icon={Users} tint="primary" />
        <StatCard label="Assigned This Week" value={stats.assignedWeek} icon={ClipboardList} tint="accent" />
        <StatCard label="Completed Tasks" value={stats.completed} icon={CheckCircle2} tint="success" />
        <StatCard label="Pending Tasks" value={stats.pending} icon={Clock} tint="destructive" />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        {feed.length === 0 ? (
          <EmptyState icon={Activity} title="No recent activity" subtitle="Completed tasks will show up here." />
        ) : (
          <div className="overflow-hidden rounded-lg border bg-card shadow-card">
            {feed.map(({ task, employee }, i) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 px-5 py-3.5 ${i !== feed.length - 1 ? "border-b" : ""}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                  {initials(employee?.name ?? "?")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    <span className="font-semibold">{employee?.name}</span> completed{" "}
                    <span className="font-medium">{task.title}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {task.completedDate ? formatDate(task.completedDate) : ""} · {formatDuration(task.timeSpentSeconds)} tracked
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success" size={20} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}