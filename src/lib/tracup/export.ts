function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportCSV(headers: string[], rows: (string | number)[][], filename: string) {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows].map((r) => r.map(esc).join(",")).join("\n");
  download(filename, csv, "text/csv;charset=utf-8");
}

export function exportExcel(headers: string[], rows: (string | number)[][], filename: string) {
  const cell = (v: string | number) =>
    `<td>${String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`;
  const thead = `<tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>`;
  const tbody = rows.map((r) => `<tr>${r.map(cell).join("")}</tr>`).join("");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>th{background:#1E293B;color:#fff;padding:6px}td{padding:6px;border:1px solid #ccc}</style></head><body><table>${thead}${tbody}</table></body></html>`;
  download(filename, html, "application/vnd.ms-excel");
}