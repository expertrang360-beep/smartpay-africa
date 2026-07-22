import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import { Eye, EyeOff, Plus, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Sparkles } from "lucide-react";

export function WalletCard() {
  const { balance, pendingBalance, currency, balanceHidden, toggleHideBalance, smartMode } = useStore();

  const mask = (val: number) => (balanceHidden ? "•••••••" : formatNaira(val));

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[oklch(0.42_0.24_265)] to-[oklch(0.32_0.22_268)] p-6 text-white shadow-brand md:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 size-56 rounded-full bg-white/5 blur-3xl" />
      <div className="relative">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Total balance</span>
              <button onClick={toggleHideBalance} aria-label={balanceHidden ? "Show balance" : "Hide balance"} className="grid size-6 place-items-center rounded-md bg-white/10 hover:bg-white/20">
                {balanceHidden ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
              </button>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight tabular-nums md:text-5xl">{mask(balance)}</span>
              <span className="text-xs font-semibold text-white/70">{currency}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-white/70">
              <span>Available <span className="font-semibold text-white">{mask(balance - pendingBalance)}</span></span>
              <span>Pending <span className="font-semibold text-white">{mask(pendingBalance)}</span></span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block size-1.5 rounded-full bg-emerald-400" /> Active
              </span>
            </div>
          </div>
          {smartMode && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
              <Sparkles className="size-3" /> Smart
            </span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2 md:gap-3">
          <ActionButton to="/wallet/fund" icon={Plus} label="Fund" primary />
          <ActionButton to="/transfers" icon={ArrowUpRight} label="Send" />
          <ActionButton to="/wallet" icon={ArrowDownLeft} label="Receive" />
          <ActionButton to="/wallet" icon={ArrowLeftRight} label="Withdraw" />
        </div>
      </div>
    </div>
  );
}

function ActionButton({ to, icon: Icon, label, primary }: { to: string; icon: typeof Plus; label: string; primary?: boolean }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-xs font-semibold transition-transform hover:scale-[1.02] ${
        primary
          ? "bg-white text-primary shadow-lg shadow-black/10"
          : "bg-white/15 text-white backdrop-blur ring-1 ring-white/20"
      }`}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}
