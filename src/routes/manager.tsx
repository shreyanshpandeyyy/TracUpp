import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, ClipboardPlus, BarChart3 } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/tracup/DashboardShell";
import { getSession } from "@/lib/tracup/auth";
import { ensureSeed } from "@/lib/tracup/store";
import type { Session } from "@/lib/tracup/types";

export const Route = createFileRoute("/manager")({
  component: ManagerLayout,
});

const items: NavItem[] = [
  { label: "Dashboard", to: "/manager", icon: LayoutDashboard },
  { label: "My Team", to: "/manager/team", icon: Users },
  { label: "Assign Task", to: "/manager/assign", icon: ClipboardPlus },
  { label: "Reports", to: "/manager/reports", icon: BarChart3 },
];

function ManagerLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    ensureSeed();
    const s = getSession();
    if (!s || s.role !== "manager") {
      navigate({ to: "/" });
      return;
    }
    setSession(s);
  }, [navigate]);

  if (!session) return null;

  return (
    <DashboardShell items={items} roleLabel="Manager" name={session.name}>
      <Outlet />
    </DashboardShell>
  );
}