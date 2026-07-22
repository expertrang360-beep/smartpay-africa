import { useStore, type Notification } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";
import { Bell, ShieldAlert, CheckCircle2, Info, Megaphone, type LucideIcon } from "lucide-react";
import { Card, CardHeader, Badge } from "./Card";

const iconFor: Record<Notification["priority"], { icon: LucideIcon; ring: string; bg: string }> = {
  info: { icon: Info, ring: "ring-sky-500/20", bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  success: { icon: CheckCircle2, ring: "ring-emerald-500/20", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  warning: { icon: ShieldAlert, ring: "ring-amber-500/20", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  critical: { icon: ShieldAlert, ring: "ring-rose-500/20", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
};

export function NotificationsCard({ limit = 4 }: { limit?: number }) {
  const { notifications, markNotificationsRead } = useStore();
  const list = notifications.slice(0, limit);

  return (
    <Card>
      <CardHeader
        title="Notifications"
        subtitle={`${notifications.filter((n) => !n.read).length} unread`}
        icon={Bell}
        action={
          <button
            onClick={markNotificationsRead}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Mark all read
          </button>
        }
      />
      <ul className="divide-y divide-border">
        {list.map((n) => {
          const cfg = iconFor[n.priority];
          return (
            <li key={n.id} className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 p-4 ${!n.read ? "bg-primary-soft/30" : ""}`}>
              <div className={`grid size-9 shrink-0 place-items-center rounded-xl ${cfg.bg}`}>
                <cfg.icon className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold">{n.title}</span>
                  {!n.read && <Badge tone="primary">New</Badge>}
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                <span className="mt-1 inline-block text-[10px] font-medium text-muted-foreground">
                  {formatDistanceToNow(n.createdAt, { addSuffix: true })} · {n.category}
                </span>
              </div>
              <button className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold hover:bg-muted">
                View
              </button>
            </li>
          );
        })}
        {list.length === 0 && (
          <li className="p-8 text-center text-sm text-muted-foreground">
            <Megaphone className="mx-auto mb-2 size-8 opacity-30" />
            You're all caught up.
          </li>
        )}
      </ul>
    </Card>
  );
}
