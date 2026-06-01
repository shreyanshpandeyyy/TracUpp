export type Priority = "Low" | "Medium" | "High";
export type TaskStatus = "ongoing" | "completed";
export type TaskSource = "self" | "manager";

export interface Task {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // ISO date (yyyy-mm-dd)
  createdDate: string; // ISO date
  estimatedHours: number;
  status: TaskStatus;
  source: TaskSource;
  timeSpentSeconds: number; // logged time
  completedDate?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
}

export type Role = "employee" | "manager";

export interface Session {
  role: Role;
  employeeId?: string;
  name: string;
}