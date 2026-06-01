import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  CheckSquare,
  Inbox,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/tracup/DashboardShell";
import { getSession } from "@/lib/tracup/auth";
import { ensureSeed } from "@/lib/tracup/store";
import type { Session } from "@/lib/tracup/types";

export const Route = createFileRoute("/employee")({
  component: EmployeeLayout,
});

const items: NavItem[] = [
  { label: "Dashboard", to: "/employee", icon: LayoutDashboard },
  { label: "Add New Task", to: "/employee/add", icon: PlusCircle },
  { label: "Ongoing Tasks", to: "/employee/ongoing", icon: ListTodo },
  { label: "Completed Tasks", to: "/employee/completed", icon: CheckSquare },
  { label: "Assigned Tasks", to: "/employee/assigned", icon: Inbox },
];

function EmployeeLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    ensureSeed();
    const s = getSession();
    if (!s || s.role !== "employee") {
      navigate({ to: "/" });
      return;
    }
    setSession(s);
  }, [navigate]);

  if (!session) return null;

  return (
    <DashboardShell items={items} roleLabel="Employee" name={session.name}>
      <Outlet />
    </DashboardShell>
  );
}