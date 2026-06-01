import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, UserCog, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { login, getSession } from "@/lib/tracup/auth";
import { ensureSeed } from "@/lib/tracup/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TracUP — Employee Task & Time Management" },
      {
        name: "description",
        content: "TracUP is a clean, modern task and time tracking workspace for employees and managers.",
      },
      { property: "og:title", content: "TracUP — Task & Time Management" },
      {
        property: "og:description",
        content: "Track tasks, log time, and manage your team in one focused dashboard.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"employee" | "manager">("employee");
  const [email, setEmail] = useState("emp@tracup.com");
  const [password, setPassword] = useState("pass123");

  useEffect(() => {
    ensureSeed();
    const s = getSession();
    if (s) navigate({ to: s.role === "manager" ? "/manager" : "/employee" });
  }, [navigate]);

  const switchRole = (r: "employee" | "manager") => {
    setRole(r);
    setEmail(r === "employee" ? "emp@tracup.com" : "mgr@tracup.com");
    setPassword("pass123");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const session = login(role, email, password);
    if (!session) {
      toast.error("Invalid credentials");
      return;
    }
    toast.success(`Welcome back, ${session.name.split(" ")[0]}!`);
    navigate({ to: role === "manager" ? "/manager" : "/employee" });
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Brand panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-bold tracking-tight">TracUP</span>
        </div>
        <div>
          <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
            Track tasks. Log time. Lead your team.
          </h1>
          <p className="mt-4 max-w-md text-primary-foreground/70">
            A focused workspace for getting work done — built for employees and managers alike.
          </p>
        </div>
        <p className="font-mono text-xs text-primary-foreground/50">v1.0 · workspace edition</p>
      </div>

      {/* Login form */}
      <div className="flex w-full flex-col items-center justify-center bg-background px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="text-xl font-bold tracking-tight">TracUP</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose your role to continue.</p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-secondary p-1">
            {(["employee", "manager"] as const).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold capitalize transition",
                  role === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r === "employee" ? <Briefcase className="h-4 w-4" size={16} /> : <UserCog className="h-4 w-4" size={16} />}
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
                required
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
            >
              Sign in as {role}
              <ArrowRight className="h-4 w-4" size={16} />
            </button>
          </form>

          <div className="mt-6 rounded-md border border-dashed bg-secondary/50 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Demo credentials</p>
            <p className="mt-1 font-mono">Employee · emp@tracup.com / pass123</p>
            <p className="font-mono">Manager · mgr@tracup.com / pass123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
