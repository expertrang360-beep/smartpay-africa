import { createFileRoute } from "@tanstack/react-router";
import { LineChart as LineIcon, TrendingUp, Users, Zap } from "lucide-react";
import { AppShell, PageHeader, PageContainer } from "@/components/AppShell";
import { Card, CardHeader, Badge } from "@/components/payroxa/Card";
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Payroxa" },
      { name: "description", content: "Real-time analytics across wallet growth, transfer trends, bill payments, provider performance and user growth." },
      { property: "og:title", content: "Payroxa Analytics" },
      { property: "og:description", content: "Real-time revenue, transfers, bills and provider performance analytics." },
    ],
  }),
  component: AnalyticsPage,
});

const walletGrowth = Array.from({ length: 30 }, (_, i) => ({ d: `D${i + 1}`, v: 4200 + i * 80 + Math.sin(i / 3) * 200 }));
const transferTrend = Array.from({ length: 12 }, (_, i) => ({ m: `M${i + 1}`, v: 800 + i * 60 + Math.sin(i) * 100 }));
const billCat = [
  { c: "Airtime", v: 320 }, { c: "Data", v: 480 }, { c: "Power", v: 620 },
  { c: "Cable", v: 210 }, { c: "Internet", v: 180 }, { c: "Betting", v: 90 }, { c: "Gift", v: 60 },
];
const userGrowth = Array.from({ length: 12 }, (_, i) => ({ m: `M${i + 1}`, active: 1200 + i * 180 + Math.sin(i) * 80, new: 200 + i * 20 }));

function AnalyticsPage() {
  return (
    <AppShell>
      <PageHeader title="Analytics" subtitle="Real-time performance across every service" icon={LineIcon}
        actions={<>
          <Badge tone="success">Live</Badge>
          <select className="h-9 rounded-lg border border-border bg-surface px-3 text-xs font-semibold">
            <option>Last 30 days</option><option>Last 90 days</option><option>Last year</option>
          </select>
        </>}
      />
      <PageContainer className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Wallet growth" subtitle="Total funded balance (₦M)" icon={TrendingUp} />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={walletGrowth}>
                  <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.48 0.24 264)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.48 0.24 264)" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="v" stroke="oklch(0.48 0.24 264)" fill="url(#wg)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Transfer trends" subtitle="Volume by month (₦M)" icon={Zap} />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={transferTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="v" stroke="oklch(0.72 0.17 162)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Bills by category" subtitle="Volume (₦M) · this month" />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={billCat}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="c" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="v" fill="oklch(0.78 0.16 72)" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="User growth" subtitle="Active vs new users" icon={Users} />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={userGrowth}>
                  <defs>
                    <linearGradient id="ug1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.48 0.24 264)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.48 0.24 264)" stopOpacity={0} /></linearGradient>
                    <linearGradient id="ug2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.72 0.17 162)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.72 0.17 162)" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="active" stroke="oklch(0.48 0.24 264)" fill="url(#ug1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="new" stroke="oklch(0.72 0.17 162)" fill="url(#ug2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  );
}
