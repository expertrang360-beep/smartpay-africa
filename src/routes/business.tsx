import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Users, ReceiptText, TrendingUp, Wallet } from "lucide-react";
import { useStore } from "@/lib/store";
import { AppShell, PageHeader, PageContainer } from "@/components/AppShell";
import { Card, CardHeader, Badge } from "@/components/payroxa/Card";
import { StatCard } from "@/components/payroxa/StatCard";
import { formatNaira } from "@/lib/format";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "Business — Payroxa" },
      { name: "description", content: "Run your business on Payroxa: business wallet, invoices, payroll, expenses and team approvals." },
      { property: "og:title", content: "Payroxa for Business" },
      { property: "og:description", content: "Business wallet, invoices, payroll and expense management for growing teams." },
    ],
  }),
  component: BusinessPage,
});

const payroll = [
  { m: "Apr", v: 3.2 }, { m: "May", v: 3.4 }, { m: "Jun", v: 3.8 }, { m: "Jul", v: 4.1 }, { m: "Aug", v: 4.6 },
];

const spark = (b: number) => Array.from({ length: 10 }, (_, i) => ({ v: b + Math.round(Math.sin(i) * b * 0.2) + i * (b * 0.03) }));

function BusinessPage() {
  const { team } = useStore();
  return (
    <AppShell>
      <PageHeader title="Business" subtitle="Payroxa for Business · Kola Foods" icon={Briefcase}
        actions={<Badge tone="success">Verified · Tier 3</Badge>}
      />
      <PageContainer className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Business balance" value={formatNaira(4_820_000, { compact: true })} change="+12%" icon={Wallet} series={spark(50)} tone="primary" />
          <StatCard label="Invoices outstanding" value={formatNaira(680_000, { compact: true })} change="8 open" icon={ReceiptText} series={spark(20)} tone="warning" />
          <StatCard label="Payroll (Aug)" value={formatNaira(4_600_000, { compact: true })} change="+8%" icon={Users} series={spark(45)} tone="success" />
          <StatCard label="Cash flow" value={formatNaira(1_320_000, { compact: true })} change="+3.4%" icon={TrendingUp} series={spark(35)} tone="success" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader title="Payroll trend" subtitle="Monthly disbursements (₦M)" />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={payroll}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="v" fill="oklch(0.48 0.24 264)" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <CardHeader title="Pending approvals" subtitle="3 need your sign-off" action={<Badge tone="warning">Action</Badge>} />
            <ul className="divide-y divide-border">
              {[
                ["Payroll · Aug", "₦4,600,000", "Ada Okoro", "high"],
                ["Vendor · Verde", "₦210,000", "Ifeanyi Uche", "med"],
                ["Refund · #4820", "₦18,500", "Zainab Bello", "low"],
              ].map(([t, a, by, p]) => (
                <li key={t as string} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{t}</div>
                    <div className="text-xs text-muted-foreground">Requested by {by}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tabular-nums">{a}</span>
                    <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Approve</button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card>
          <CardHeader title="Team" subtitle={`${team.length} members`} icon={Users} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 text-left">Member</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Department</th>
                  <th className="px-5 py-3 text-left">Permission</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {team.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">{u.name.split(" ").map(n => n[0]).slice(0, 2).join("")}</div>
                        <div><div className="font-semibold">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><Badge tone={u.role === "Owner" ? "primary" : "neutral"}>{u.role}</Badge></td>
                    <td className="px-5 py-3 text-muted-foreground">{u.department}</td>
                    <td className="px-5 py-3 capitalize">{u.permission}</td>
                    <td className="px-5 py-3"><Badge tone={u.status === "active" ? "success" : u.status === "invited" ? "info" : "danger"}>{u.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </PageContainer>
    </AppShell>
  );
}
