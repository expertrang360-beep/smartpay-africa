import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Plus, Eye, Copy } from "lucide-react";
import { useStore } from "@/lib/store";
import { AppShell, PageHeader, PageContainer } from "@/components/AppShell";
import { Card, CardHeader, Badge } from "@/components/payroxa/Card";
import { VirtualCardTile } from "@/components/payroxa/VirtualCardTile";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/cards")({
  head: () => ({
    meta: [
      { title: "Cards — Payroxa" },
      { name: "description", content: "Create virtual Naira and USD cards for subscriptions, business and travel. Freeze, unfreeze and control every card." },
      { property: "og:title", content: "Payroxa Virtual Cards" },
      { property: "og:description", content: "Virtual Visa, Mastercard and Verve cards with real-time controls." },
    ],
  }),
  component: CardsPage,
});

function CardsPage() {
  const { cards } = useStore();
  const total = cards.reduce((sum, c) => sum + (c.currency === "NGN" ? c.balance : c.balance * 1600), 0);

  return (
    <AppShell>
      <PageHeader
        title="Virtual cards"
        subtitle="Ship subscriptions, spend online, or issue cards to your team"
        icon={CreditCard}
        actions={<button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-brand"><Plus className="size-4" /> New card</button>}
      />
      <PageContainer className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-4"><div className="text-xs text-muted-foreground">Total across cards</div><div className="mt-1 text-xl font-bold tabular-nums">{formatNaira(total, { compact: true })}</div></div>
            <div className="rounded-2xl border border-border bg-surface p-4"><div className="text-xs text-muted-foreground">Active cards</div><div className="mt-1 text-xl font-bold tabular-nums">{cards.filter(c => !c.frozen).length}</div></div>
            <div className="rounded-2xl border border-border bg-surface p-4"><div className="text-xs text-muted-foreground">Monthly spend</div><div className="mt-1 text-xl font-bold tabular-nums">{formatNaira(240000, { compact: true })}</div></div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {cards.map((c) => <VirtualCardTile key={c.id} card={c} />)}
            <button className="grid aspect-[1.586/1] place-items-center rounded-3xl border-2 border-dashed border-border text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary">
              <div className="flex flex-col items-center gap-2"><Plus className="size-6" /> Create new card</div>
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Card controls" icon={Eye} />
            <ul className="divide-y divide-border">
              {["Online payments", "International use", "ATM withdrawals", "Contactless"].map((c, i) => (
                <li key={c} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
                  <span className="text-sm font-semibold">{c}</span>
                  <span className={`inline-flex h-5 w-9 items-center rounded-full ${i === 3 ? "bg-muted" : "bg-primary"}`}>
                    <span className={`size-4 rounded-full bg-white shadow transition-transform ${i === 3 ? "translate-x-0.5" : "translate-x-4"}`} />
                  </span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Details · Personal" subtitle="Reveal to copy" action={<Badge tone="primary">Visa</Badge>} />
            <dl className="space-y-3 p-5 text-sm">
              {[
                ["Number", "4021 •••• •••• 4021"], ["CVV", "•••"], ["Expiry", "09/28"], ["Billing zip", "100001"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="flex items-center gap-2 font-mono font-semibold">{v} <Copy className="size-3.5 cursor-pointer text-muted-foreground hover:text-foreground" /></dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  );
}
