import type { Employee, Task } from "./types";
import { weekDays } from "@/components/tracup/CalendarStrip";

export interface EmployeeStats {
  employee: Employee;
  total: number;
  completed: number;
  ongoing: number;
  totalSeconds: number;
  avgSeconds: number;
  activeCount: number;
}

export function statsForEmployee(employee: Employee, tasks: Task[]): EmployeeStats {
  const mine = tasks.filter((t) => t.employeeId === employee.id);
  const completed = mine.filter((t) => t.status === "completed");
  const ongoing = mine.filter((t) => t.status === "ongoing");
  const totalSeconds = mine.reduce((s, t) => s + t.timeSpentSeconds, 0);
  return {
    employee,
    total: mine.length,
    completed: completed.length,
    ongoing: ongoing.length,
    totalSeconds,
    avgSeconds: mine.length ? Math.round(totalSeconds / mine.length) : 0,
    activeCount: ongoing.length,
  };
}

export function assignedThisWeek(tasks: Task[]): number {
  const days = new Set(weekDays());
  return tasks.filter((t) => t.source === "manager" && days.has(t.createdDate)).length;
}