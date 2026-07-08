import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { NetworkChip } from "@/components/NetworkChip";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import {
  detectNetwork, quoteAirtime, smartPick, callProvider, type Network,
} from "@/lib/mock-vtu";
import { Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/airtime")({
  validateSearch: z.object({ phone: z.string().optional() }),
  component: AirtimePage,
});

const NETWORKS: Network[] = ["MTN", "Airtel", "Glo", "9mobile"];
const QUICK = [100, 200, 500, 1000, 2000, 5000];

function AirtimePage() {
  const { phone: initialPhone } = Route.useSearch();
  const navigate = useNavigate();
  const { balance, smartMode, debit, updateTxn, bumpFrequent, credit, margins } = useStore();

  const [phone, setPhone] = useState(initialPhone ?? "");
  const [amount, setAmount] = useState<number>(500);
  const [manualNetwork, setManualNetwork] = useState<Network | null>(null);
  const [loading, setLoading] = useState(false);

  const detected = detectNetwork(phone);
  const network = manualNetwork ?? detected;

  async function handleBuy() {
    if (!network) return toast.error("Enter a valid phone number");
    if (!amount || amount < 50) return toast.error("Minimum amount is ₦50");
    if (amount > balance) return toast.error("Insufficient wallet balance");

    const quotes = quoteAirtime(amount);
    const pick = smartMode ? smartPick(quotes) : quotes[0];

    const txn = debit(amount, {
      kind: "airtime",
      title: `${network} Airtime`,
      subtitle: phone,
      status: "pending",
      ref: "pending",
      providerId: pick.providerId,
      providerName: pick.providerName,
      meta: { network, phone },
    });
    if (!txn) return;

    setLoading(true);
    let result = await callProvider(pick.providerId, { amount, phone, network });
    // Retry with next provider on failure
    if (!result.success) {
      toast.info(`${pick.providerName} failed — retrying via backup provider`);
      const backup = quotes.find((q) => q.providerId !== pick.providerId);
      if (backup) result = await callProvider(backup.providerId, { amount, phone, network });
    }
    setLoading(false);

    if (result.success) {
      const cashback = Math.round(amount * (margins.airtime / 100) * 0.3);
      updateTxn(txn.id, { status: "success", ref: result.ref, cashback });
      if (cashback > 0) {
        credit(cashback, { kind: "cashback", title: "Cashback", subtitle: `From ₦${amount} airtime`, ref: result.ref, status: "success" });
      }
      bumpFrequent(phone, network);
      toast.success(`₦${amount.toLocaleString()} sent to ${phone}`);
      navigate({ to: "/transactions/$id", params: { id: txn.id } });
    } else {
      updateTxn(txn.id, { status: "failed", ref: result.ref });
      credit(amount, { kind: "fund", title: "Refund", subtitle: "Failed airtime purchase", ref: result.ref, status: "success" });
      toast.error("All providers unavailable — you've been refunded.");
    }
  }

  return (
    <AppShell>
      <PageHeader title="Buy airtime" subtitle="Instant delivery on all networks" back="/" />

      <div className="space-y-5 px-5 pb-8">
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Phone number
          </label>
          <div className="mt-2 flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3 ring-1 ring-border focus-within:ring-primary">
            {network ? <NetworkChip network={network} size={32} /> : (
              <div className="grid size-8 place-items-center rounded-lg bg-muted text-[10px] font-bold text-muted-foreground">?</div>
            )}
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
              inputMode="numeric"
              placeholder="0803 000 0000"
              className="w-full bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {NETWORKS.map((n) => (
              <button
                key={n}
                onClick={() => setManualNetwork(manualNetwork === n ? null : n)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition-colors ${
                  network === n
                    ? "bg-primary text-primary-foreground ring-primary"
                    : "bg-surface text-muted-foreground ring-border hover:ring-primary/40"
                }`}
              >
                {n}
              </button>
            ))}
            {detected && !manualNetwork && (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300">
                auto-detected
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Amount
          </label>
          <div className="mt-2 flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3 ring-1 ring-border focus-within:ring-primary">
            <span className="text-lg font-semibold text-muted-foreground">₦</span>
            <input
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")))}
              inputMode="numeric"
              placeholder="0"
              className="w-full bg-transparent text-lg font-bold tabular-nums outline-none"
            />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(q)}
                className={`rounded-xl py-2 text-sm font-semibold ring-1 transition-colors ${
                  amount === q
                    ? "bg-primary text-primary-foreground ring-primary"
                    : "bg-surface text-foreground ring-border hover:ring-primary/40"
                }`}
              >
                ₦{q.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {smartMode && network && amount >= 50 && (
          <div className="flex items-center gap-3 rounded-2xl bg-primary-soft/60 p-3 ring-1 ring-primary/15">
            <Sparkles className="size-4 text-primary" />
            <div className="text-xs">
              <span className="font-semibold text-primary">Smart routed</span>
              <span className="text-muted-foreground"> · picking cheapest + fastest provider</span>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-muted/40 p-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Wallet balance</span>
            <span className="tabular-nums">{formatNaira(balance)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm font-semibold">
            <span>You pay</span>
            <span className="tabular-nums text-base">{formatNaira(amount)}</span>
          </div>
        </div>

        <button
          disabled={loading || !network || amount < 50}
          onClick={handleBuy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-brand transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Processing…" : `Buy ${formatNaira(amount)} airtime`}
        </button>
      </div>
    </AppShell>
  );
}
