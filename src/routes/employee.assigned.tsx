import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Inbox } from "lucide-react";
import { useTasks } from "@/lib/tracup/store";
import { CURRENT_EMPLOYEE_ID } from "@/lib/tracup/seed";
import { TaskCard } from "@/components/tracup/TaskCard";
import { EmptyState } from "@/components/tracup/EmptyState";

export const Route = createFileRoute("/employee/assigned")({
  component: Assigned,
});

function Assigned() {
  const tasks = useTasks();
  const list = useMemo(
    () => tasks.filter((t) => t.employeeId === CURRENT_EMPLOYEE_ID && t.source === "manager"),
    [tasks],
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Assigned Tasks</h1>
        <p className="mt-1 text-muted-foreground">Tasks your manager has assigned to you.</p>
      </header>
      {list.length === 0 ? (
        <EmptyState icon={Inbox} title="No assigned tasks" subtitle="Tasks assigned by your manager show up here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((t) => (
            <TaskCard key={t.id} task={t} variant="assigned" />
          ))}
        </div>
      )}
    </div>
  );
}