import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { logout } from "@/lib/tracup/auth";
import { initials } from "@/lib/tracup/format";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = path === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({
  items,
  roleLabel,
  name,
  onNavigate,
}: {
  items: NavItem[];
  roleLabel: string;
  name: string;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="leading-tight">
          <p className="text-lg font-bold tracking-tight">TracUP</p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
            {roleLabel}
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <NavLinks items={items} onNavigate={onNavigate} />
      </div>
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md px-3 py-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            {initials(name)}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-sidebar-foreground/50">{roleLabel}</p>
          </div>
          <button
            aria-label="Log out"
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
            className="rounded-md p-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({
  items,
  roleLabel,
  name,
  children,
}: {
  items: NavItem[];
  roleLabel: string;
  name: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <SidebarInner items={items} roleLabel={roleLabel} name={name} />
        </div>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 border-0 p-0">
          <SidebarInner items={items} roleLabel={roleLabel} name={name} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 hover:bg-muted"
          >
            <Menu className="h-5 w-5" size={20} />
          </button>
          <span className="font-bold tracking-tight">TracUP</span>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl animate-page-in">{children}</div>
        </main>
      </div>
    </div>
  );
}

export { X };