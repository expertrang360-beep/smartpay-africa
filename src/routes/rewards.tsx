import { createFileRoute } from "@tanstack/react-router";
import { Gift, Sparkles, Copy, Share2, Trophy } from "lucide-react";
import { useStore } from "@/lib/store";
import { AppShell, PageHeader, PageContainer } from "@/components/AppShell";
import { Card, CardHeader, Badge } from "@/components/payroxa/Card";
import { formatNaira } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — Payroxa" },
      { name: "description", content: "Earn PRX points on every payment. Redeem for airtime, gift cards, and cashback. Refer friends for ₦500 each." },
      { property: "og:title", content: "Payroxa Rewards" },
      { property: "og:description", content: "PRX points, cashback, referral bonuses and tier upgrades." },
    ],
  }),
  component: RewardsPage,
});

const levels = [
  { name: "Bronze", min: 0 }, { name: "Silver", min: 1000 },
  { name: "Gold", min: 3000 }, { name: "Platinum", min: 5000 },
];

function RewardsPage() {
  const { prxPoints, level, cashback, referralCode, referralEarnings } = useStore();
  const currentIdx = levels.findIndex((l) => l.name === level);
  const next = levels[currentIdx + 1];
  const pct = next ? Math.min(100, ((prxPoints - levels[currentIdx].min) / (next.min - levels[currentIdx].min)) * 100) : 100;
  const link = `https://payroxa.ng/join/${referralCode}`;

  return (
    <AppShell>
      <PageHeader title="Rewards & referrals" subtitle="Get paid to pay bills" icon={Gift} />
      <PageContainer className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary/40 via-secondary/20 to-transparent p-8">
            <Sparkles className="absolute -right-4 -top-4 size-32 text-secondary/30" />
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Payroxa · {level} tier</div>
            <div className="mt-2 text-5xl font-bold tabular-nums">{prxPoints.toLocaleString()} <span className="text-lg font-semibold text-muted-foreground">PRX</span></div>
            <div className="mt-1 text-sm text-muted-foreground">Lifetime cashback {formatNaira(cashback)}</div>
            {next && (
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>{level}</span><span>{next.name}</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-background">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{(next.min - prxPoints).toLocaleString()} PRX to {next.name}</div>
              </div>
            )}
            <button className="mt-6 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background">Redeem points</button>
          </div>

          <Card>
            <CardHeader title="Redeem" subtitle="Convert PRX to any of these" icon={Gift} />
            <div className="grid gap-3 p-5 sm:grid-cols-3">
              {[
                { label: "₦500 airtime", cost: "1,000 PRX", tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
                { label: "1GB data", cost: "1,500 PRX", tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
                { label: "₦5,000 cashback", cost: "10,000 PRX", tone: "bg-primary-soft text-primary" },
              ].map((r) => (
                <div key={r.label} className="rounded-2xl border border-border p-4">
                  <div className={`mb-3 inline-grid size-9 place-items-center rounded-lg ${r.tone}`}><Gift className="size-4" /></div>
                  <div className="text-sm font-semibold">{r.label}</div>
                  <div className="text-xs text-muted-foreground">{r.cost}</div>
                  <button className="mt-3 h-9 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground">Redeem</button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Refer & earn" subtitle="₦500 per friend who joins" icon={Trophy} action={<Badge tone="success">{formatNaira(referralEarnings)} earned</Badge>} />
            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-dashed border-primary/30 bg-primary-soft/40 p-4 text-center">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">Your code</div>
                <div className="mt-1 font-mono text-2xl font-bold tracking-widest text-primary">{referralCode}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { navigator.clipboard?.writeText(link); toast.success("Link copied"); }} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-xs font-semibold">
                  <Copy className="size-3.5" /> Copy link
                </button>
                <button onClick={() => navigator.share?.({ title: "Join Payroxa", url: link })} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground">
                  <Share2 className="size-3.5" /> Share
                </button>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title="Leaderboard" subtitle="Top earners this month" />
            <ul className="divide-y divide-border">
              {[["Ada Okoro", 12, 6000], ["Ifeanyi Uche", 9, 4500], ["Zainab Bello", 7, 3500], ["You", 5, 2500]].map(([n, c, e], i) => (
                <li key={String(n)} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3">
                  <div className={`grid size-8 place-items-center rounded-lg text-xs font-bold ${i === 0 ? "bg-amber-500/20 text-amber-700" : "bg-muted text-muted-foreground"}`}>#{i + 1}</div>
                  <div className="min-w-0"><div className="truncate text-sm font-semibold">{n}</div><div className="text-[11px] text-muted-foreground">{c} referrals</div></div>
                  <div className="text-sm font-semibold tabular-nums">{formatNaira(Number(e))}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  );
}
