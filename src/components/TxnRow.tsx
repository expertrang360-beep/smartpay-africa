import type { Transaction } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@tanstack/react-router";
import { Phone, Wifi, Zap, Tv, ArrowDownToLine, ArrowUpFromLine, Gift, Users } from "lucide-react";

const iconMap = {
  airtime: { icon: Phone, bg: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  data: { icon: Wifi, bg: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  electricity: { icon: Zap, bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300" },
  cable: { icon: Tv, bg: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
  fund: { icon: ArrowDownToLine, bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  withdraw: { icon: ArrowUpFromLine, bg: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
  cashback: { icon: Gift, bg: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300" },
  referral: { icon: Users, bg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" },
  bonus: { icon: Gift, bg: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300" },
} as const;

const statusStyle = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/15 dark:bg-amber-500/10 dark:text-amber-300",
  failed: "bg-rose-50 text-rose-700 ring-rose-600/15 dark:bg-rose-500/10 dark:text-rose-300",
};

export function TxnRow({ txn }: { txn: Transaction }) {
  const cfg = iconMap[txn.kind];
  const Icon = cfg.icon;
  return (
    <Link
      to="/transactions/$id"
      params={{ id: txn.id }}
      className="flex items-center gap-3 rounded-2xl bg-surface p-3 ring-1 ring-transparent transition-all hover:ring-border"
    >
      <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${cfg.bg}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{txn.title}</div>
        <div className="truncate text-[11px] text-muted-foreground">
          {txn.subtitle} · {formatDistanceToNow(txn.createdAt, { addSuffix: true })}
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-semibold tabular-nums ${txn.amount < 0 ? "" : "text-emerald-600 dark:text-emerald-400"}`}>
          {formatNaira(txn.amount, { sign: true })}
        </div>
        <span className={`mt-0.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ring-1 ${statusStyle[txn.status]}`}>
          {txn.status}
        </span>
      </div>
    </Link>
  );
}

export { statusStyle };
