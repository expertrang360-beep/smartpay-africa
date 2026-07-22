import { createFileRoute } from "@tanstack/react-router";
import { Store, Plus, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { AppShell, PageHeader, PageContainer } from "@/components/AppShell";
import { Card, CardHeader, Badge, StatusDot } from "@/components/payroxa/Card";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/merchants")({
  head: () => ({
    meta: [
      { title: "Merchants — Payroxa" },
      { name: "description", content: "Manage merchant accounts, monitor volume, revenue and settlements across your Payroxa business network." },
      { property: "og:title", content: "Payroxa Merchants" },
      { property: "og:description", content: "Merchant volume, revenue, pending settlements and today's sales." },
    ],
  }),
  component: MerchantsPage,
});

function MerchantsPage() {
  const { merchants } = useStore();
  const totalVol = merchants.reduce((s, m) => s + m.volume, 0);
  const totalRev = merchants.reduce((s, m) => s + m.revenue, 0);
  const totalPending = merchants.reduce((s, m) => s + m.pending, 0);

  return (
    <AppShell>
      <PageHeader
        title="Merchants"
        subtitle={`${merchants.length} active partners · ${formatNaira(totalVol, { compact: true })} lifetime volume`}
        icon={Store}
        actions={<button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4" /> Add merchant</button>}
      />
      <PageContainer className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5"><div className="text-xs text-muted-foreground">Total volume</div><div className="mt-1 text-2xl font-bold tabular-nums">{formatNaira(totalVol, { compact: true })}</div></div>
          <div className="rounded-2xl border border-border bg-surface p-5"><div className="text-xs text-muted-foreground">Revenue (fees)</div><div className="mt-1 text-2xl font-bold tabular-nums">{formatNaira(totalRev, { compact: true })}</div></div>
          <div className="rounded-2xl border border-border bg-surface p-5"><div className="text-xs text-muted-foreground">Pending settlement</div><div className="mt-1 text-2xl font-bold tabular-nums">{formatNaira(totalPending, { compact: true })}</div></div>
        </div>

        <Card>
          <CardHeader
            title="All merchants"
            action={
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input placeholder="Search…" className="h-9 rounded-lg border border-border bg-surface pl-8 pr-3 text-xs" />
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 text-left">Merchant</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-right">Volume</th>
                  <th className="px-5 py-3 text-right">Revenue</th>
                  <th className="px-5 py-3 text-right">Pending</th>
                  <th className="px-5 py-3 text-right">Today</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {merchants.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-sm font-black text-primary">{m.logo}</div>
                        <div><div className="font-semibold">{m.name}</div><div className="text-xs text-muted-foreground">ID {m.id.toUpperCase()}</div></div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><Badge>{m.category}</Badge></td>
                    <td className="px-5 py-4 text-right tabular-nums">{formatNaira(m.volume, { compact: true })}</td>
                    <td className="px-5 py-4 text-right tabular-nums font-semibold">{formatNaira(m.revenue, { compact: true })}</td>
                    <td className="px-5 py-4 text-right tabular-nums text-amber-600 dark:text-amber-400">{formatNaira(m.pending, { compact: true })}</td>
                    <td className="px-5 py-4 text-right tabular-nums">{formatNaira(m.todaySales, { compact: true })}</td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 text-xs font-semibold"><StatusDot /> Live</span></td>
                    <td className="px-5 py-4 text-right"><button className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold hover:bg-muted">Manage</button></td>
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
