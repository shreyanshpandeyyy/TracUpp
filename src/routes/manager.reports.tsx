import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { FileSpreadsheet, FileDown } from "lucide-react";
import { toast } from "sonner";
import { useEmployees, useTasks } from "@/lib/tracup/store";
import { statsForEmployee } from "@/lib/tracup/stats";
import { formatDuration } from "@/lib/tracup/format";
import { exportCSV, exportExcel } from "@/lib/tracup/export";

export const Route = createFileRoute("/manager/reports")({
  component: Reports,
});

function Reports() {
  const employees = useEmployees();
  const tasks = useTasks();

  const rows = useMemo(
    () => employees.map((e) => statsForEmployee(e, tasks)),
    [employees, tasks],
  );

  const headers = ["Name", "Role", "Total Tasks", "Completed", "Ongoing", "Avg Time Per Task"];
  const dataRows = rows.map((s) => [
    s.employee.name,
    s.employee.role,
    s.total,
    s.completed,
    s.ongoing,
    formatDuration(s.avgSeconds),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="mt-1 text-muted-foreground">Per-employee task and time summary.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              exportCSV(headers, dataRows, "tracup-report.csv");
              toast.success("CSV downloaded");
            }}
            className="inline-flex items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm font-semibold transition hover:bg-secondary"
          >
            <FileDown className="h-4 w-4" size={16} />
            Export CSV
          </button>
          <button
            onClick={() => {
              exportExcel(headers, dataRows, "tracup-report.xls");
              toast.success("Excel downloaded");
            }}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            <FileSpreadsheet className="h-4 w-4" size={16} />
            Export Excel
          </button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-lg border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Total Tasks</th>
              <th className="px-5 py-3 font-semibold">Completed</th>
              <th className="px-5 py-3 font-semibold">Ongoing</th>
              <th className="px-5 py-3 font-semibold">Avg Time / Task</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.employee.id} className="border-b last:border-0">
                <td className="px-5 py-3">
                  <p className="font-medium">{s.employee.name}</p>
                  <p className="text-xs text-muted-foreground">{s.employee.role}</p>
                </td>
                <td className="px-5 py-3 font-mono">{s.total}</td>
                <td className="px-5 py-3 font-mono text-success">{s.completed}</td>
                <td className="px-5 py-3 font-mono text-accent">{s.ongoing}</td>
                <td className="px-5 py-3 font-mono">{formatDuration(s.avgSeconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}