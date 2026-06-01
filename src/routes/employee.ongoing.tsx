import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { ListTodo } from "lucide-react";
import { useTasks } from "@/lib/tracup/store";
import { CURRENT_EMPLOYEE_ID } from "@/lib/tracup/seed";
import { TaskCard } from "@/components/tracup/TaskCard";
import { EmptyState } from "@/components/tracup/EmptyState";

export const Route = createFileRoute("/employee/ongoing")({
  component: Ongoing,
});

function Ongoing() {
  const tasks = useTasks();
  const list = useMemo(
    () =>
      tasks.filter(
        (t) => t.employeeId === CURRENT_EMPLOYEE_ID && t.status === "ongoing" && t.source === "self",
      ),
    [tasks],
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Ongoing Tasks</h1>
        <p className="mt-1 text-muted-foreground">Start the timer to track time spent on each task.</p>
      </header>
      {list.length === 0 ? (
        <EmptyState icon={ListTodo} title="No ongoing tasks" subtitle="Add a new task to get started." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((t) => (
            <TaskCard key={t.id} task={t} variant="timer" />
          ))}
        </div>
      )}
    </div>
  );
}