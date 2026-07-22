import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { type LucideIcon } from "lucide-react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-surface shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({
  title, subtitle, action, icon: Icon,
}: { title: string; subtitle?: string; action?: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4">
      <div className="flex min-w-0 items-center gap-2.5">
        {Icon && (
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
            <Icon className="size-4" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{title}</h3>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function SectionLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="text-xs font-semibold text-primary hover:underline">
      {label} →
    </Link>
  );
}

export function StatusDot({ tone = "success" }: { tone?: "success" | "warning" | "danger" | "info" }) {
  const cls =
    tone === "success" ? "bg-emerald-500" :
    tone === "warning" ? "bg-amber-500" :
    tone === "danger" ? "bg-rose-500" : "bg-sky-500";
  return <span className={`inline-block size-2 rounded-full ${cls}`} aria-hidden />;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "info" | "primary" }) {
  const map = {
    neutral: "bg-muted text-muted-foreground",
    success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    danger: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    info: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    primary: "bg-primary-soft text-primary",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${map[tone]}`}>
      {children}
    </span>
  );
}
