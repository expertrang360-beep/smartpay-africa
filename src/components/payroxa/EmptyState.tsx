import type { ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon, title, description, action,
}: { icon: LucideIcon; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-12 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="size-7" />
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}
