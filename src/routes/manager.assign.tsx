import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { addTask, newId, useEmployees, useTasks } from "@/lib/tracup/store";
import type { Priority } from "@/lib/tracup/types";
import { PriorityBadge } from "@/components/tracup/PriorityBadge";
import { formatDate } from "@/lib/tracup/format";
import { todayISO } from "@/components/tracup/CalendarStrip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/manager/assign")({
  component: Assign,
});

const priorities: Priority[] = ["Low", "Medium", "High"];
const pillStyle: Record<Priority, string> = {
  Low: "data-[active=true]:bg-priority-low data-[active=true]:text-priority-low-foreground",
  Medium: "data-[active=true]:bg-priority-medium data-[active=true]:text-priority-medium-foreground",
  High: "data-[active=true]:bg-priority-high data-[active=true]:text-priority-high-foreground",
};

function Assign() {
  const employees = useEmployees();
  const tasks = useTasks();
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState(todayISO());
  const [hours, setHours] = useState("4");

  const assigned = useMemo(
    () =>
      tasks
        .filter((t) => t.source === "manager")
        .sort((a, b) => b.createdDate.localeCompare(a.createdDate)),
    [tasks],
  );

  const empName = (id: string) => employees.find((e) => e.id === id)?.name ?? "—";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !title.trim()) {
      toast.error("Pick an employee and enter a title");
      return;
    }
    addTask({
      id: newId(),
      employeeId,
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      createdDate: todayISO(),
      estimatedHours: Number(hours) || 0,
      status: "ongoing",
      source: "manager",
      timeSpentSeconds: 0,
    });
    toast.success(`Assigned "${title.trim()}" to ${empName(employeeId)}`);
    setTitle("");
    setDescription("");
  };

  const inputCls =
    "w-full rounded-md border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Assign Task</h1>
        <p className="mt-1 text-muted-foreground">Delegate work to a team member.</p>
      </header>

      <form onSubmit={submit} className="grid gap-5 rounded-lg border bg-card p-6 shadow-card lg:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Employee</label>
          <select className={inputCls} value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} · {e.role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Task Title</label>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Prepare release notes" />
        </div>
        <div className="lg:col-span-2">
          <label className="mb-1.5 block text-sm font-medium">Description</label>
          <textarea
            className={cn(inputCls, "min-h-[90px] resize-y")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add context for the task…"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Priority</label>
          <div className="flex gap-2">
            {priorities.map((p) => (
              <button
                key={p}
                type="button"
                data-active={priority === p}
                onClick={() => setPriority(p)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-semibold text-muted-foreground transition data-[active=true]:border-transparent",
                  pillStyle[p],
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Due Date</label>
            <input type="date" className={inputCls} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Est. Hours</label>
            <input type="number" min="0" step="0.5" className={inputCls} value={hours} onChange={(e) => setHours(e.target.value)} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            <Send className="h-4 w-4" size={16} />
            Assign Task
          </button>
        </div>
      </form>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Previously assigned</h2>
        <div className="overflow-x-auto rounded-lg border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Employee</th>
                <th className="px-5 py-3 font-semibold">Task</th>
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-5 py-3 font-semibold">Due Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {assigned.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    No tasks assigned yet.
                  </td>
                </tr>
              ) : (
                assigned.map((t) => (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="px-5 py-3 font-medium">{empName(t.employeeId)}</td>
                    <td className="px-5 py-3">{t.title}</td>
                    <td className="px-5 py-3"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-5 py-3 font-mono text-xs">{formatDate(t.dueDate)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                          t.status === "completed" ? "bg-success/10 text-success" : "bg-accent/10 text-accent",
                        )}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}