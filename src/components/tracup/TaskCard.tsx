import { useEffect, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, Pause, Play, Square, UserCog } from "lucide-react";
import { toast } from "sonner";
import type { Task } from "@/lib/tracup/types";
import { completeTask, logTime } from "@/lib/tracup/store";
import { formatClock, formatDate, formatDuration } from "@/lib/tracup/format";
import { PriorityBadge } from "./PriorityBadge";
import { cn } from "@/lib/utils";

function LiveTimer({ task }: { task: Task }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // current session seconds
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const stop = () => {
    setRunning(false);
    if (elapsed > 0) {
      logTime(task.id, elapsed);
      toast.success(`Logged ${formatDuration(elapsed)} to "${task.title}"`);
      setElapsed(0);
    }
  };

  return (
    <div className="mt-4 flex items-center justify-between rounded-md bg-secondary/70 px-3 py-2">
      <div>
        <p className="font-mono text-lg font-medium tabular-nums">{formatClock(elapsed)}</p>
        <p className="text-[11px] text-muted-foreground">
          Logged total: {formatDuration(task.timeSpentSeconds + elapsed)}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        {!running ? (
          <button
            onClick={() => setRunning(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-success text-success-foreground transition hover:opacity-90"
            aria-label="Start timer"
          >
            <Play className="h-4 w-4" size={16} />
          </button>
        ) : (
          <button
            onClick={() => setRunning(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-priority-medium text-priority-medium-foreground transition hover:opacity-90"
            aria-label="Pause timer"
          >
            <Pause className="h-4 w-4" size={16} />
          </button>
        )}
        <button
          onClick={stop}
          disabled={elapsed === 0 && !running}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
          aria-label="Stop and log"
        >
          <Square className="h-3.5 w-3.5" size={14} />
        </button>
      </div>
    </div>
  );
}

export function TaskCard({
  task,
  variant = "plain",
}: {
  task: Task;
  variant?: "plain" | "timer" | "completed" | "assigned";
}) {
  const completed = variant === "completed" || task.status === "completed";
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-5 shadow-card transition",
        variant !== "completed" && "hover-lift",
        completed && "opacity-70",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={cn("font-semibold leading-snug", completed && "line-through")}>{task.title}</h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
          )}
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" size={14} />
          {completed ? `Done ${formatDate(task.completedDate ?? task.dueDate)}` : `Due ${formatDate(task.dueDate)}`}
        </span>
        <span className="font-mono">Est {task.estimatedHours}h</span>
        {(completed || task.timeSpentSeconds > 0) && (
          <span className="font-mono">Tracked {formatDuration(task.timeSpentSeconds)}</span>
        )}
        {variant === "assigned" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 font-semibold text-accent">
            <UserCog className="h-3 w-3" size={12} />
            Assigned by Manager
          </span>
        )}
      </div>

      {variant === "timer" && <LiveTimer task={task} />}

      {variant === "timer" && (
        <button
          onClick={() => {
            completeTask(task.id);
            toast.success(`"${task.title}" marked complete`);
          }}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm font-semibold text-success transition hover:bg-success/20"
        >
          <CheckCircle2 className="h-4 w-4" size={16} />
          Mark Complete
        </button>
      )}
    </div>
  );
}