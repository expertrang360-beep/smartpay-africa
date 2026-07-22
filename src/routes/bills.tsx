import { createFileRoute, Link } from "@tanstack/react-router";
import { ReceiptText, Phone, Wifi, Zap, Tv, Globe, Ticket, Gift, Star } from "lucide-react";
import { AppShell, PageHeader, PageContainer } from "@/components/AppShell";
import { Card, CardHeader, Badge } from "@/components/payroxa/Card";

export const Route = createFileRoute("/bills")({
  head: () => ({
    meta: [
      { title: "Bills & Payments — Payroxa" },
      { name: "description", content: "Pay every bill in Nigeria: airtime, data, electricity, cable TV, internet, betting and gift cards — with Smart Mode routing." },
      { property: "og:title", content: "Payroxa Bills" },
      { property: "og:description", content: "Airtime, data, electricity, cable, internet, betting, gift cards." },
    ],
  }),
  component: BillsPage,
});

const categories = [
  { to: "/airtime", label: "Airtime", icon: Phone, tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", last: "MTN · ₦2,000" },
  { to: "/data", label: "Data", icon: Wifi, tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300", last: "MTN 5GB · ₦2,450" },
  { to: "/electricity", label: "Electricity", icon: Zap, tone: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300", last: "EKEDC · ₦15,000" },
  { to: "/cable", label: "Cable TV", icon: Tv, tone: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300", last: "DSTV Confam · ₦9,300" },
  { to: "/bills", label: "Internet", icon: Globe, tone: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300", last: "Spectranet · ₦22,000" },
  { to: "/bills", label: "Betting", icon: Ticket, tone: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300", last: "Bet9ja · ₦5,000" },
  { to: "/bills", label: "Gift Cards", icon: Gift, tone: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300", last: "Amazon $25" },
];

const providers = [
  { name: "MTN", cat: "Telco", fav: true }, { name: "Airtel", cat: "Telco", fav: true }, { name: "Glo", cat: "Telco", fav: false }, { name: "9mobile", cat: "Telco", fav: false },
  { name: "EKEDC", cat: "Power", fav: true }, { name: "IKEDC", cat: "Power", fav: false }, { name: "AEDC", cat: "Power", fav: false }, { name: "PHED", cat: "Power", fav: false },
  { name: "DSTV", cat: "Cable", fav: true }, { name: "GOTV", cat: "Cable", fav: false }, { name: "Startimes", cat: "Cable", fav: false },
  { name: "Spectranet", cat: "Internet", fav: false }, { name: "Smile", cat: "Internet", fav: false }, { name: "Bet9ja", cat: "Betting", fav: false },
  { name: "SportyBet", cat: "Betting", fav: false }, { name: "Amazon", cat: "Gift", fav: true }, { name: "Steam", cat: "Gift", fav: false }, { name: "iTunes", cat: "Gift", fav: false },
];

function BillsPage() {
  return (
    <AppShell>
      <PageHeader title="Bills & payments" subtitle="Pay any bill in Nigeria — instantly" icon={ReceiptText} />
      <PageContainer className="space-y-6">
        <Card>
          <CardHeader title="Categories" subtitle="Tap to start a payment" />
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 lg:grid-cols-7">
            {categories.map((c) => (
              <Link key={c.label} to={c.to} className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-center transition-all hover:border-primary/40 hover:shadow-card">
                <div className={`grid size-12 place-items-center rounded-2xl ${c.tone}`}><c.icon className="size-6" /></div>
                <div className="text-sm font-semibold">{c.label}</div>
                <div className="text-[10px] text-muted-foreground">Last: {c.last}</div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Providers" subtitle="18 available · sorted by usage" action={<Badge tone="primary">Favourites first</Badge>} />
          <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 lg:grid-cols-6">
            {providers.sort((a, b) => Number(b.fav) - Number(a.fav)).map((p) => (
              <div key={p.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-border bg-surface p-3">
                <div className="grid size-9 place-items-center rounded-lg bg-primary-soft text-xs font-black text-primary">{p.name.slice(0, 2).toUpperCase()}</div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground">{p.cat}</div>
                </div>
                <Star className={`size-4 shrink-0 ${p.fav ? "fill-amber-400 text-amber-500" : "text-muted-foreground/40"}`} />
              </div>
            ))}
          </div>
        </Card>
      </PageContainer>
    </AppShell>
  );
}
