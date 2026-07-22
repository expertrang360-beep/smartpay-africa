import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  TrendingUp, Wallet as WalletIcon, ArrowUpRight, Sparkles,
  Users, ShieldCheck, ReceiptText, Rocket, Zap,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import { AppShell, PageContainer } from "@/components/AppShell";
import { WalletCard } from "@/components/payroxa/WalletCard";
import { QuickActions } from "@/components/payroxa/QuickActions";
import { StatCard } from "@/components/payroxa/StatCard";
import { NotificationsCard } from "@/components/payroxa/NotificationsCard";
import { TxnRow } from "@/components/TxnRow";
import { Card, CardHeader, Badge, SectionLink } from "@/components/payroxa/Card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Payroxa" },
      { name: "description", content: "Payroxa dashboard: wallet balance, quick actions, spending analytics, and recent activity." },
      { property: "og:title", content: "Dashboard — Payroxa" },
      { property: "og:description", content: "Payroxa dashboard: wallet balance, quick actions, spending analytics, and recent activity." },
    ],
  }),
  component: Dashboard,
});

const revenueSeries = [
  { m: "Jan", revenue: 420, expense: 260 }, { m: "Feb", revenue: 510, expense: 290 },
  { m: "Mar", revenue: 480, expense: 310 }, { m: "Apr", revenue: 640, expense: 340 },
  { m: "May", revenue: 720, expense: 380 }, { m: "Jun", revenue: 810, expense: 400 },
  { m: "Jul", revenue: 940, expense: 420 }, { m: "Aug", revenue: 1050, expense: 460 },
];
const spendPie = [
  { name: "Bills", value: 34, color: "oklch(0.48 0.24 264)" },
  { name: "Transfers", value: 28, color: "oklch(0.72 0.17 162)" },
  { name: "Airtime/Data", value: 18, color: "oklch(0.78 0.16 72)" },
  { name: "Cards", value: 12, color: "oklch(0.62 0.22 25)" },
  { name: "Other", value: 8, color: "oklch(0.52 0.02 258)" },
];
const spark = (base: number) =>
  Array.from({ length: 12 }, (_, i) => ({ v: base + Math.round(Math.sin(i / 2) * base * 0.15) + i * (base * 0.02) }));

function Dashboard() {
  const { name, transactions, prxPoints, level, kycProgress } = useStore();
  const recent = transactions.slice(0, 6);
  const totalIn = useMemo(() => transactions.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0), [transactions]);
  const totalOut = useMemo(() => Math.abs(transactions.filter((t) => t.amount < 0).reduce((a, t) => a + t.amount, 0)), [transactions]);

  return (
    <AppShell>
      <PageContainer className="space-y-6">
        {/* Greeting */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Welcome back</p>
            <h1 className="truncate text-2xl font-bold tracking-tight md:text-3xl">Good afternoon, {name.split(" ")[0]}</h1>
          </div>
          <Link to="/wallet/fund" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-brand hover:opacity-95">
            <Rocket className="size-4" /> Fund wallet
          </Link>
        </div>

        {/* Row 1: Wallet + KYC/Rewards */}
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <WalletCard />
          <div className="grid gap-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <ShieldCheck className="size-3.5" /> Account verification
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold tabular-nums">{kycProgress}%</div>
                  <p className="text-xs text-muted-foreground">Tier 3 in progress</p>
                </div>
                <Badge tone="warning">Action needed</Badge>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${kycProgress}%` }} />
              </div>
              <Link to="/settings" className="mt-4 inline-flex text-xs font-semibold text-primary">Complete verification →</Link>
            </Card>
            <Card className="bg-gradient-to-br from-secondary/20 to-transparent p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <Sparkles className="size-3.5" /> Rewards · {level}
              </div>
              <div className="mt-2 text-2xl font-bold tabular-nums">{prxPoints.toLocaleString()} PRX</div>
              <p className="mt-1 text-xs text-muted-foreground">1,180 pts to Platinum</p>
              <Link to="/rewards" className="mt-3 inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
                Redeem <ArrowUpRight className="size-3" />
              </Link>
            </Card>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Money in (30d)" value={formatNaira(totalIn, { compact: true })} change="+12.4%" trend="up" icon={ArrowUpRight} series={spark(80)} tone="success" />
          <StatCard label="Money out (30d)" value={formatNaira(totalOut, { compact: true })} change="+3.1%" trend="up" icon={ReceiptText} series={spark(60)} tone="warning" />
          <StatCard label="Cashback earned" value={formatNaira(useStore.getState().cashback)} change="+₦2,140" trend="up" icon={Sparkles} series={spark(40)} tone="primary" />
          <StatCard label="Active beneficiaries" value={String(useStore.getState().beneficiaries.length)} change="+2 this month" trend="up" icon={Users} series={spark(30)} tone="primary" />
        </div>

        {/* Quick actions */}
        <QuickActions />

        {/* Charts row */}
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader
              title="Revenue vs expenses"
              subtitle="Last 8 months, all wallets"
              icon={TrendingUp}
              action={<Badge tone="success">+18.2%</Badge>}
            />
            <div className="p-4 pt-2">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueSeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.48 0.24 264)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.48 0.24 264)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.17 162)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="oklch(0.72 0.17 162)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${v}k`} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.48 0.24 264)" fill="url(#rev)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" stroke="oklch(0.72 0.17 162)" fill="url(#exp)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Spending by category" subtitle="This month" icon={Zap} />
            <div className="p-4">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={spendPie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {spendPie.map((s) => <Cell key={s.name} fill={s.color} />)}
                  </Pie>
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent activity + notifications */}
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader
              title="Recent transactions"
              icon={WalletIcon}
              action={<SectionLink to="/transactions" label="See all" />}
            />
            <div className="space-y-2 p-3">
              {recent.map((t) => <TxnRow key={t.id} txn={t} />)}
            </div>
          </Card>
          <NotificationsCard />
        </div>

        {/* Bills due + provider bar chart */}
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader title="Upcoming payments" subtitle="Auto-detected from your history" />
            <ul className="divide-y divide-border">
              {[
                { name: "EKEDC prepaid", when: "Tomorrow", amount: 15000, tone: "warning" as const },
                { name: "DSTV Confam", when: "In 4 days", amount: 9300, tone: "info" as const },
                { name: "MTN Data · 10GB", when: "In 8 days", amount: 4900, tone: "info" as const },
              ].map((b) => (
                <li key={b.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{b.name}</div>
                    <div className="text-xs text-muted-foreground">Due {b.when}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tabular-nums">{formatNaira(b.amount)}</span>
                    <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Pay now</button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Provider performance" subtitle="Smart Mode routing" />
            <div className="p-4">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { p: "SmartBill", ok: 98, fail: 2 },
                  { p: "QuickVTU", ok: 94, fail: 6 },
                  { p: "AfriPay", ok: 99, fail: 1 },
                  { p: "PayHub", ok: 96, fail: 4 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="p" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="ok" stackId="a" fill="oklch(0.48 0.24 264)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="fail" stackId="a" fill="oklch(0.62 0.22 25)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  );
}
