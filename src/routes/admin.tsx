import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { Activity, Users, Wallet, TrendingUp, Zap, Power, Wifi, Phone, Tv, Radio } from "lucide-react";
import { format, subDays } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const { transactions, services, margins, toggleService, setMargin, isAdmin } = useStore();
  const [broadcast, setBroadcast] = useState("");

  if (!isAdmin) {
    return (
      <AppShell>
        <PageHeader title="Admin" />
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">Access denied.</div>
      </AppShell>
    );
  }

  // Aggregate stats
  const totals = useMemo(() => {
    const debits = transactions.filter((t) => t.amount < 0);
    const volume = debits.reduce((s, t) => s + Math.abs(t.amount), 0);
    const success = debits.filter((t) => t.status === "success").length;
    const failed = debits.filter((t) => t.status === "failed").length;
    const pending = debits.filter((t) => t.status === "pending").length;
    const profit = debits.reduce((s, t) => {
      const key = t.kind === "airtime" ? "airtime"
        : t.kind === "data" ? "data"
        : t.kind === "electricity" ? "electricity"
        : t.kind === "cable" ? "cable" : null;
      if (!key) return s;
      return s + Math.abs(t.amount) * (margins[key] / 100);
    }, 0);
    return { volume, success, failed, pending, profit, total: debits.length };
  }, [transactions, margins]);

  // 7-day series
  const series = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
    return days.map((d) => {
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end = new Date(d); end.setHours(23, 59, 59, 999);
      const dayTxns = transactions.filter((t) => t.createdAt >= start.getTime() && t.createdAt <= end.getTime() && t.amount < 0);
      return {
        day: format(d, "EEE"),
        volume: dayTxns.reduce((s, t) => s + Math.abs(t.amount), 0),
        count: dayTxns.length,
      };
    });
  }, [transactions]);

  const byService = useMemo(() => {
    const map: Record<string, number> = { airtime: 0, data: 0, electricity: 0, cable: 0 };
    transactions.forEach((t) => {
      if (t.amount < 0 && map[t.kind] !== undefined) map[t.kind] += Math.abs(t.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const serviceMeta = {
    airtime: { name: "Airtime", icon: Phone },
    data: { name: "Data", icon: Wifi },
    electricity: { name: "Electricity", icon: Zap },
    cable: { name: "Cable TV", icon: Tv },
  } as const;

  return (
    <AppShell>
      <PageHeader title="Admin dashboard" subtitle="Live operations & controls" back="/" />
      <div className="space-y-5 px-5 pb-8">
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Wallet} label="Volume (all-time)" value={formatNaira(totals.volume)} tone="brand" />
          <StatCard icon={TrendingUp} label="Est. profit" value={formatNaira(totals.profit)} tone="success" />
          <StatCard icon={Activity} label="Transactions" value={String(totals.total)} tone="default" />
          <StatCard icon={Users} label="Active user" value="1" tone="default" />
        </div>

        <div className="rounded-2xl bg-surface p-4 ring-1 ring-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Volume · last 7 days</h3>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">₦</span>
          </div>
          <div className="mt-3 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.22 260)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.58 0.22 260)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.92 0.008 250)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "oklch(0.52 0.02 258)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.52 0.02 258)" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.008 250)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v) => formatNaira(Number(v))}
                />
                <Area type="monotone" dataKey="volume" stroke="oklch(0.58 0.22 260)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-4 ring-1 ring-border">
          <h3 className="text-sm font-semibold">Volume by service</h3>
          <div className="mt-3 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byService}>
                <CartesianGrid stroke="oklch(0.92 0.008 250)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "oklch(0.52 0.02 258)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.52 0.02 258)" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip formatter={(v) => formatNaira(Number(v))} contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.008 250)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" fill="oklch(0.58 0.22 260)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-4 ring-1 ring-border">
          <h3 className="text-sm font-semibold">Health · txn status</h3>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Health tone="emerald" label="Success" count={totals.success} />
            <Health tone="amber" label="Pending" count={totals.pending} />
            <Health tone="rose" label="Failed" count={totals.failed} />
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-4 ring-1 ring-border">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Service controls</h3>
            <Power className="size-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {(Object.keys(serviceMeta) as (keyof typeof serviceMeta)[]).map((k) => {
              const meta = serviceMeta[k];
              return (
                <div key={k} className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
                    <meta.icon className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{meta.name}</div>
                    <div className="text-[11px] text-muted-foreground">Margin · {margins[k]}%</div>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="20"
                    value={margins[k]}
                    onChange={(e) => setMargin(k, Number(e.target.value))}
                    className="w-16 rounded-lg bg-muted px-2 py-1 text-right text-xs font-semibold tabular-nums ring-1 ring-border outline-none focus:ring-primary"
                  />
                  <button
                    onClick={() => toggleService(k)}
                    className={`inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      services[k] ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span className={`size-4 rounded-full bg-white shadow transition-transform ${services[k] ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-4 ring-1 ring-border">
          <h3 className="flex items-center gap-2 text-sm font-semibold"><Radio className="size-4" /> Broadcast message</h3>
          <textarea
            value={broadcast}
            onChange={(e) => setBroadcast(e.target.value)}
            rows={2}
            placeholder="Message all users…"
            className="mt-3 w-full resize-none rounded-xl bg-muted/50 p-3 text-sm ring-1 ring-border outline-none focus:ring-primary"
          />
          <button
            onClick={() => { if (broadcast.trim()) { toast.success(`Broadcast sent to 1 user`); setBroadcast(""); } }}
            className="mt-2 w-full rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground"
          >
            Send broadcast
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon: Icon, label, value, tone,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone: "brand" | "success" | "default" }) {
  const styles = {
    brand: "bg-gradient-to-br from-primary to-[oklch(0.42_0.24_268)] text-white",
    success: "bg-emerald-500 text-white",
    default: "bg-surface ring-1 ring-border",
  };
  return (
    <div className={`rounded-2xl p-4 shadow-card ${styles[tone]}`}>
      <Icon className="size-4 opacity-80" />
      <div className={`mt-2 text-[10px] font-semibold uppercase tracking-widest ${tone === "default" ? "text-muted-foreground" : "opacity-80"}`}>{label}</div>
      <div className="mt-0.5 text-lg font-bold tabular-nums">{value}</div>
    </div>
  );
}

function Health({ tone, label, count }: { tone: "emerald" | "amber" | "rose"; label: string; count: number }) {
  const cls = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300",
    amber: "bg-amber-50 text-amber-700 ring-amber-600/15 dark:bg-amber-500/10 dark:text-amber-300",
    rose: "bg-rose-50 text-rose-700 ring-rose-600/15 dark:bg-rose-500/10 dark:text-rose-300",
  }[tone];
  return (
    <div className={`rounded-xl p-3 ring-1 ${cls}`}>
      <div className="text-[10px] font-semibold uppercase tracking-widest opacity-80">{label}</div>
      <div className="text-2xl font-bold tabular-nums">{count}</div>
    </div>
  );
}
