export function ProgressRing({
  value,
  total,
  size = 96,
}: {
  value: number;
  total: number;
  size?: number;
}) {
  const pct = total === 0 ? 0 : value / total;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--secondary)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold">{Math.round(pct * 100)}%</span>
        <span className="text-[10px] text-muted-foreground">
          {value}/{total}
        </span>
      </div>
    </div>
  );
}