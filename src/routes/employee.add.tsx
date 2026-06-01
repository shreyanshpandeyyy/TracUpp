import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addTask, newId } from "@/lib/tracup/store";
import { CURRENT_EMPLOYEE_ID } from "@/lib/tracup/seed";
import type { Priority } from "@/lib/tracup/types";
import { cn } from "@/lib/utils";
import { todayISO } from "@/components/tracup/CalendarStrip";

export const Route = createFileRoute("/employee/add")({
  component: AddTask,
});

const priorities: Priority[] = ["Low", "Medium", "High"];
const pillStyle: Record<Priority, string> = {
  Low: "data-[active=true]:bg-priority-low data-[active=true]:text-priority-low-foreground",
  Medium: "data-[active=true]:bg-priority-medium data-[active=true]:text-priority-medium-foreground",
  High: "data-[active=true]:bg-priority-high data-[active=true]:text-priority-high-foreground",
};

function AddTask() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState(todayISO());
  const [hours, setHours] = useState("4");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    addTask({
      id: newId(),
      employeeId: CURRENT_EMPLOYEE_ID,
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      createdDate: todayISO(),
      estimatedHours: Number(hours) || 0,
      status: "ongoing",
      source: "self",
      timeSpentSeconds: 0,
    });
    toast.success("Task added to Ongoing");
    navigate({ to: "/employee/ongoing" });
  };

  const inputCls =
    "w-full rounded-md border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Add New Task</h1>
        <p className="mt-1 text-muted-foreground">Create a task and start tracking your time.</p>
      </header>

      <form onSubmit={submit} className="max-w-2xl space-y-5 rounded-lg border bg-card p-6 shadow-card">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Task Title</label>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Build the settings page" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Description</label>
          <textarea
            className={cn(inputCls, "min-h-[110px] resize-y")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details…"
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
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Due Date</label>
            <input type="date" className={inputCls} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Estimated Time (hours)</label>
            <input type="number" min="0" step="0.5" className={inputCls} value={hours} onChange={(e) => setHours(e.target.value)} />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" size={16} />
          Create Task
        </button>
      </form>
    </div>
  );
}