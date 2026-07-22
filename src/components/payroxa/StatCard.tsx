import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, LineChart, Line } from "recharts";
import type { ReactNode } from "react";

export function StatCard({
  label, value, change, trend = "up", icon: Icon, series, tone = "primary",
}: {
  label: string;
  value: ReactNode;
  change?: string;
  trend?: "up" | "down";
  icon?: LucideIcon;
  series?: { v: number }[];
  tone?: "primary" | "success" | "warning" | "danger";
}) {
  const toneMap = {
    primary: "text-primary",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-rose-600 dark:text-rose-400",
  };
  const strokeMap = {
    primary: "hsl(var(--color-primary))",
    success: "oklch(0.72 0.17 162)",
    warning: "oklch(0.78 0.16 72)",
    danger: "oklch(0.62 0.22 25)",
  };
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            {Icon && <Icon className="size-3.5" />}
            {label}
          </div>
          <div className="mt-2 truncate text-2xl font-bold tracking-tight tabular-nums md:text-3xl">{value}</div>
          {change && (
            <div className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              <TrendIcon className="size-3.5" /> {change}
            </div>
          )}
        </div>
        {series && (
          <div className="h-12 w-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <Line type="monotone" dataKey="v" stroke="currentColor" className={toneMap[tone]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export function AreaMiniChart({ data, dataKey = "v", stroke }: { data: { v: number; label?: string }[]; dataKey?: string; stroke?: string }) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke ?? "oklch(0.48 0.24 264)"} stopOpacity={0.4} />
            <stop offset="100%" stopColor={stroke ?? "oklch(0.48 0.24 264)"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey={dataKey} stroke={stroke ?? "oklch(0.48 0.24 264)"} strokeWidth={2} fill="url(#areaFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
