import type { Employee, Task } from "./types";

export const EMPLOYEES: Employee[] = [
  { id: "emp-1", name: "Alice Carter", role: "Frontend Engineer", email: "alice@tracup.com" },
  { id: "emp-2", name: "Bob Nguyen", role: "Backend Engineer", email: "bob@tracup.com" },
  { id: "emp-3", name: "Priya Sharma", role: "Product Designer", email: "priya@tracup.com" },
  { id: "emp-4", name: "James Riley", role: "QA Engineer", email: "james@tracup.com" },
  { id: "emp-5", name: "Sara Lopez", role: "DevOps Engineer", email: "sara@tracup.com" },
];

// The logged-in employee account maps to Alice.
export const CURRENT_EMPLOYEE_ID = "emp-1";

function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

let counter = 0;
function makeTask(t: Partial<Task> & { employeeId: string; title: string }): Task {
  counter += 1;
  return {
    id: `task-${counter}`,
    description: "",
    priority: "Medium",
    dueDate: dateOffset(2),
    createdDate: dateOffset(-1),
    estimatedHours: 4,
    status: "ongoing",
    source: "self",
    timeSpentSeconds: 0,
    ...t,
  };
}

const h = (hours: number, mins = 0) => hours * 3600 + mins * 60;

export const SEED_TASKS: Task[] = [
  // Alice (current employee)
  makeTask({
    employeeId: "emp-1",
    title: "Build dashboard layout",
    description: "Implement the responsive grid for the main dashboard view.",
    priority: "High",
    dueDate: dateOffset(0),
    createdDate: dateOffset(0),
    estimatedHours: 6,
    timeSpentSeconds: h(2, 15),
  }),
  makeTask({
    employeeId: "emp-1",
    title: "Refactor auth flow",
    description: "Clean up the login state management and add validation.",
    priority: "Medium",
    dueDate: dateOffset(3),
    createdDate: dateOffset(-2),
    timeSpentSeconds: h(1, 40),
  }),
  makeTask({
    employeeId: "emp-1",
    title: "Fix navbar spacing bug",
    description: "Resolve the misaligned items on tablet breakpoints.",
    priority: "Low",
    status: "completed",
    createdDate: dateOffset(-5),
    completedDate: dateOffset(-3),
    timeSpentSeconds: h(1, 5),
  }),
  makeTask({
    employeeId: "emp-1",
    title: "Quarterly UI audit",
    description: "Review components for accessibility and consistency.",
    priority: "High",
    source: "manager",
    dueDate: dateOffset(5),
    createdDate: dateOffset(-1),
    estimatedHours: 8,
  }),
  // Bob
  makeTask({ employeeId: "emp-2", title: "Optimize DB queries", priority: "High", timeSpentSeconds: h(3, 20) }),
  makeTask({ employeeId: "emp-2", title: "Write API docs", priority: "Low", status: "completed", completedDate: dateOffset(-1), timeSpentSeconds: h(2) }),
  makeTask({ employeeId: "emp-2", title: "Setup rate limiting", priority: "Medium", source: "manager", dueDate: dateOffset(4) }),
  // Priya
  makeTask({ employeeId: "emp-3", title: "Design onboarding flow", priority: "High", timeSpentSeconds: h(4, 10) }),
  makeTask({ employeeId: "emp-3", title: "Update design tokens", priority: "Medium", status: "completed", completedDate: dateOffset(-2), timeSpentSeconds: h(1, 30) }),
  makeTask({ employeeId: "emp-3", title: "Mobile wireframes", priority: "Medium", source: "manager", dueDate: dateOffset(6) }),
  makeTask({ employeeId: "emp-3", title: "Icon set polish", priority: "Low", status: "completed", completedDate: dateOffset(-4), timeSpentSeconds: h(2, 45) }),
  // James
  makeTask({ employeeId: "emp-4", title: "Regression test suite", priority: "High", timeSpentSeconds: h(2, 50) }),
  makeTask({ employeeId: "emp-4", title: "Bug triage", priority: "Medium", status: "completed", completedDate: dateOffset(-1), timeSpentSeconds: h(3) }),
  makeTask({ employeeId: "emp-4", title: "Load testing", priority: "High", source: "manager", dueDate: dateOffset(2) }),
  // Sara
  makeTask({ employeeId: "emp-5", title: "CI pipeline upgrade", priority: "Medium", timeSpentSeconds: h(1, 25) }),
  makeTask({ employeeId: "emp-5", title: "Migrate to new cluster", priority: "High", status: "completed", completedDate: dateOffset(-3), timeSpentSeconds: h(5, 30) }),
  makeTask({ employeeId: "emp-5", title: "Backup automation", priority: "Low", source: "manager", dueDate: dateOffset(7) }),
];