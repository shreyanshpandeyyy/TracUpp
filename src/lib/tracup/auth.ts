import { CURRENT_EMPLOYEE_ID, EMPLOYEES } from "./seed";
import type { Session } from "./types";

const SESSION_KEY = "tracup_session";
const isBrowser = typeof window !== "undefined";

const CREDS = {
  employee: { email: "emp@tracup.com", password: "pass123" },
  manager: { email: "mgr@tracup.com", password: "pass123" },
};

export function login(role: "employee" | "manager", email: string, password: string): Session | null {
  const c = CREDS[role];
  if (email.trim().toLowerCase() !== c.email || password !== c.password) return null;
  const session: Session =
    role === "employee"
      ? {
          role,
          employeeId: CURRENT_EMPLOYEE_ID,
          name: EMPLOYEES.find((e) => e.id === CURRENT_EMPLOYEE_ID)?.name ?? "Employee",
        }
      : { role, name: "Morgan Hale" };
  if (isBrowser) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession(): Session | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function logout() {
  if (isBrowser) localStorage.removeItem(SESSION_KEY);
}