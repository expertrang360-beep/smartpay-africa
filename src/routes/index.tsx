import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Wifi, Zap, Tv, Wallet, Plus, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import { AppShell } from "@/components/AppShell";
import { TxnRow } from "@/components/TxnRow";
import { NetworkChip } from "@/components/NetworkChip";

export const Route = createFileRoute("/")({
  component: Home,
});

const services = [
  { to: "/airtime", label: "Airtime", icon: Phone, color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  { to: "/data", label: "Data", icon: Wifi, color: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  { to: "/electricity", label: "Power", icon: Zap, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300" },
  { to: "/cable", label: "Cable", icon: Tv, color: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
  { to: "/wallet", label: "Wallet", icon: Wallet, color: "bg-primary-soft text-primary" },
] as const;

function Home() {
  const { name, balance, cashback, smartMode, transactions, frequent } = useStore();
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const recent = transactions.slice(0, 4);

  return (
    <AppShell>
      {/* Greeting */}
      <header className="flex items-center justify-between px-5 pt-8 pb-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Good morning</p>
          <h2 className="text-lg font-semibold tracking-tight">{name}</h2>
        </div>
        <div className="grid size-10 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
          {initials}
        </div>
      </header>

      {/* Wallet card */}
      <section className="px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[oklch(0.54_0.22_262)] to-[oklch(0.42_0.24_268)] p-6 text-white shadow-brand">
          <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-16 -bottom-16 size-40 rounded-full bg-white/5 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
                Wallet balance
              </span>
              {smartMode && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                  <Sparkles className="size-3" /> Smart
                </span>
              )}
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight tabular-nums">{formatNaira(balance)}</span>
            </div>
            <div className="mt-1 text-[11px] opacity-80">
              Cashback earned <span className="font-semibold tabular-nums">{formatNaira(cashback)}</span>
            </div>
            <div className="mt-6 flex gap-2.5">
              <Link
                to="/wallet/fund"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-sm font-semibold text-primary shadow-lg shadow-black/10 ring-1 ring-white/40 transition-transform hover:scale-[1.02]"
              >
                <Plus className="size-4" /> Add Money
              </Link>
              <Link
                to="/wallet"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/15 py-2.5 text-sm font-semibold backdrop-blur ring-1 ring-white/20 transition-transform hover:scale-[1.02]"
              >
                Withdraw
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="px-5 py-6">
        <div className="grid grid-cols-5 gap-2">
          {services.map((s) => (
            <Link key={s.to} to={s.to} className="group flex flex-col items-center gap-1.5">
              <div className={`grid size-14 place-items-center rounded-2xl ring-1 ring-border transition-all group-active:scale-95 group-hover:ring-primary/30 bg-surface`}>
                <div className={`grid size-10 place-items-center rounded-xl ${s.color}`}>
                  <s.icon className="size-5" strokeWidth={2.2} />
                </div>
              </div>
              <span className="text-[11px] font-semibold text-foreground">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Smart tip */}
      {smartMode && (
        <section className="px-5 pb-4">
          <div className="flex items-center gap-3 rounded-2xl bg-primary-soft/60 p-3.5 ring-1 ring-primary/15">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-white">
              <TrendingUp className="size-4" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">Smart saver tip</div>
              <div className="text-xs text-foreground/80">9mobile 2GB is ₦40 cheaper than MTN today.</div>
            </div>
            <Link to="/data" className="rounded-lg bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
              Swap
            </Link>
          </div>
        </section>
      )}

      {/* Quick repeat */}
      {frequent.length > 0 && (
        <section className="px-5 pb-2">
          <h3 className="text-sm font-semibold">Quick repeat</h3>
          <div className="mt-3 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {frequent.map((f) => (
              <Link
                key={f.id}
                to="/airtime"
                search={{ phone: f.phone }}
                className="group flex shrink-0 flex-col items-center gap-1.5"
              >
                <NetworkChip network={f.network as "MTN"} size={44} />
                <span className="text-[10px] font-medium text-muted-foreground">{f.phone.slice(0, 4)}…</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent activity */}
      <section className="px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Recent activity</h3>
          <Link to="/transactions" className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary">
            See all <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {recent.map((t) => <TxnRow key={t.id} txn={t} />)}
          {recent.length === 0 && (
            <div className="rounded-2xl bg-muted/40 p-6 text-center text-xs text-muted-foreground">
              No transactions yet. Start with a top-up above.
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
