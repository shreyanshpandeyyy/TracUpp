import { useSyncExternalStore } from "react";
import type { Employee, Task } from "./types";
import { EMPLOYEES, SEED_TASKS } from "./seed";

const TASKS_KEY = "tracup_tasks";
const EMP_KEY = "tracup_employees";
const SEEDED_KEY = "tracup_seeded_v1";

const isBrowser = typeof window !== "undefined";

const listeners = new Set<() => void>();

// Snapshot cache — useSyncExternalStore requires a stable reference until data changes.
const cache: Record<string, { raw: string | null; value: unknown }> = {};

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    const entry = cache[key];
    if (entry && entry.raw === raw) return entry.value as T;
    const value = raw ? (JSON.parse(raw) as T) : fallback;
    cache[key] = { raw, value };
    return value;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser) return;
  const raw = JSON.stringify(value);
  localStorage.setItem(key, raw);
  cache[key] = { raw, value };
}

export function ensureSeed() {
  if (!isBrowser) return;
  if (!localStorage.getItem(SEEDED_KEY)) {
    write(TASKS_KEY, SEED_TASKS);
    write(EMP_KEY, EMPLOYEES);
    localStorage.setItem(SEEDED_KEY, "1");
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// ---- Tasks ----
export function getTasks(): Task[] {
  return read<Task[]>(TASKS_KEY, SEED_TASKS);
}

function setTasks(tasks: Task[]) {
  write(TASKS_KEY, tasks);
  emit();
}

export function getEmployees(): Employee[] {
  return read<Employee[]>(EMP_KEY, EMPLOYEES);
}

export function addTask(task: Task) {
  setTasks([task, ...getTasks()]);
}

export function updateTask(id: string, patch: Partial<Task>) {
  setTasks(getTasks().map((t) => (t.id === id ? { ...t, ...patch } : t)));
}

export function completeTask(id: string) {
  updateTask(id, { status: "completed", completedDate: new Date().toISOString().slice(0, 10) });
}

export function logTime(id: string, seconds: number) {
  const task = getTasks().find((t) => t.id === id);
  if (!task) return;
  updateTask(id, { timeSpentSeconds: task.timeSpentSeconds + seconds });
}

export function newId() {
  return `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// ---- Hooks ----
const serverSnapshot: Task[] = SEED_TASKS;

export function useTasks(): Task[] {
  return useSyncExternalStore(subscribe, getTasks, () => serverSnapshot);
}

export function useEmployees(): Employee[] {
  return useSyncExternalStore(subscribe, getEmployees, () => EMPLOYEES);
}