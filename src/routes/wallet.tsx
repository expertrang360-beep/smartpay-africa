import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import { TxnRow } from "@/components/TxnRow";
import { Plus, ArrowUpFromLine, Gift, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/wallet")({ component: WalletPage });

function WalletPage() {
  const { balance, cashback, referralCode, referralEarnings, transactions } = useStore();
  const wallet = transactions.filter((t) => ["fund", "withdraw", "cashback", "referral", "bonus"].includes(t.kind));

  return (
    <AppShell>
      <PageHeader title="Wallet" back="/" />
      <div className="px-5 pb-6">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.42_0.24_268)] p-6 text-white shadow-brand">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">Available balance</div>
          <div className="mt-1 text-4xl font-bold tabular-nums tracking-tight">{formatNaira(balance)}</div>
          <div className="mt-2 text-xs opacity-80">Cashback: <span className="font-semibold">{formatNaira(cashback)}</span></div>
          <div className="mt-5 flex gap-2">
            <Link to="/wallet/fund" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-sm font-semibold text-primary">
              <Plus className="size-4" /> Fund
            </Link>
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/15 py-2.5 text-sm font-semibold backdrop-blur">
              <ArrowUpFromLine className="size-4" /> Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pb-6">
        <div className="rounded-2xl bg-surface p-4 ring-1 ring-border">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <Gift className="size-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Referral earnings</div>
              <div className="text-[11px] text-muted-foreground">Share your code, earn on every purchase</div>
            </div>
            <div className="text-sm font-bold tabular-nums">{formatNaira(referralEarnings)}</div>
          </div>
          <button
            onClick={() => { navigator.clipboard?.writeText(referralCode); toast.success("Code copied"); }}
            className="mt-3 flex w-full items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-sm font-semibold"
          >
            <span className="font-mono tracking-wider">{referralCode}</span>
            <Copy className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="px-5 pb-8">
        <h3 className="mb-3 text-sm font-semibold">Wallet activity</h3>
        <div className="space-y-2">
          {wallet.length === 0 && (
            <div className="rounded-2xl bg-muted/40 p-6 text-center text-xs text-muted-foreground">
              No wallet movement yet.
            </div>
          )}
          {wallet.map((t) => <TxnRow key={t.id} txn={t} />)}
        </div>
      </div>
    </AppShell>
  );
}
