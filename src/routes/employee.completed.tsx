import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { CheckSquare } from "lucide-react";
import { useTasks } from "@/lib/tracup/store";
import { CURRENT_EMPLOYEE_ID } from "@/lib/tracup/seed";
import { TaskCard } from "@/components/tracup/TaskCard";
import { EmptyState } from "@/components/tracup/EmptyState";

export const Route = createFileRoute("/employee/completed")({
  component: Completed,
});

function Completed() {
  const tasks = useTasks();
  const list = useMemo(
    () => tasks.filter((t) => t.employeeId === CURRENT_EMPLOYEE_ID && t.status === "completed"),
    [tasks],
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Completed Tasks</h1>
        <p className="mt-1 text-muted-foreground">Everything you've wrapped up, with logged time.</p>
      </header>
      {list.length === 0 ? (
        <EmptyState icon={CheckSquare} title="Nothing completed yet" subtitle="Finished tasks will appear here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((t) => (
            <TaskCard key={t.id} task={t} variant="completed" />
          ))}
        </div>
      )}
    </div>
  );
}