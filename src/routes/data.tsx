import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { NetworkChip } from "@/components/NetworkChip";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import { DATA_PLANS, detectNetwork, callProvider, type Network } from "@/lib/mock-vtu";
import { Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/data")({
  component: DataPage,
});

const NETWORKS: Network[] = ["MTN", "Airtel", "Glo", "9mobile"];

function DataPage() {
  const navigate = useNavigate();
  const { balance, smartMode, debit, updateTxn, credit, bumpFrequent, margins } = useStore();
  const [phone, setPhone] = useState("");
  const [manualNetwork, setManualNetwork] = useState<Network | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const network = manualNetwork ?? detectNetwork(phone) ?? "MTN";
  const plans = useMemo(() => DATA_PLANS.filter((p) => p.network === network), [network]);
  const plan = plans.find((p) => p.id === planId) ?? plans[0];

  // Smart Mode cheapest suggestion for a similar size
  const cheapest = useMemo(() => {
    if (!smartMode || !plan) return null;
    return DATA_PLANS
      .filter((p) => p.size === plan.size && p.id !== plan.id)
      .sort((a, b) => a.price - b.price)[0];
  }, [plan, smartMode]);

  async function handleBuy() {
    if (!/^0\d{10}$/.test(phone)) return toast.error("Enter a valid 11-digit phone");
    if (!plan) return;
    if (plan.price > balance) return toast.error("Insufficient wallet balance");

    const txn = debit(plan.price, {
      kind: "data",
      title: `${plan.network} ${plan.size}`,
      subtitle: phone,
      status: "pending",
      ref: "pending",
      meta: { plan: plan.label },
    });
    if (!txn) return;
    setLoading(true);
    let result = await callProvider("smartbilling", { plan: plan.id, phone });
    if (!result.success) result = await callProvider("quickvtu", { plan: plan.id, phone });
    setLoading(false);
    if (result.success) {
      const cashback = Math.round(plan.price * (margins.data / 100) * 0.3);
      updateTxn(txn.id, { status: "success", ref: result.ref, cashback });
      if (cashback > 0) credit(cashback, { kind: "cashback", title: "Cashback", subtitle: `Data ${plan.size}`, ref: result.ref, status: "success" });
      bumpFrequent(phone, network);
      toast.success(`${plan.size} data sent to ${phone}`);
      navigate({ to: "/transactions/$id", params: { id: txn.id } });
    } else {
      updateTxn(txn.id, { status: "failed" });
      credit(plan.price, { kind: "fund", title: "Refund", subtitle: "Data purchase failed", ref: result.ref, status: "success" });
      toast.error("All providers unavailable — refunded.");
    }
  }

  return (
    <AppShell>
      <PageHeader title="Data bundle" subtitle="Cheapest plans, delivered instantly" back="/" />
      <div className="space-y-5 px-5 pb-8">
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Phone</label>
          <div className="mt-2 flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3 ring-1 ring-border focus-within:ring-primary">
            <NetworkChip network={network} size={32} />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
              inputMode="numeric"
              placeholder="0803 000 0000"
              className="w-full bg-transparent text-base font-medium outline-none"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {NETWORKS.map((n) => (
              <button
                key={n}
                onClick={() => { setManualNetwork(n); setPlanId(null); }}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition ${
                  network === n ? "bg-primary text-primary-foreground ring-primary"
                    : "bg-surface text-muted-foreground ring-border"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Choose plan
          </label>
          <div className="mt-2 space-y-2">
            {plans.map((p) => {
              const active = plan?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlanId(p.id)}
                  className={`flex w-full items-center justify-between rounded-2xl p-4 text-left ring-1 transition ${
                    active ? "bg-primary-soft ring-primary" : "bg-surface ring-border hover:ring-primary/40"
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold">{p.size}</div>
                    <div className="text-[11px] text-muted-foreground">{p.validity} · {p.category}</div>
                  </div>
                  <div className={`text-sm font-bold tabular-nums ${active ? "text-primary" : ""}`}>
                    ₦{p.price.toLocaleString()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {cheapest && plan && cheapest.price < plan.price && (
          <div className="flex items-center gap-3 rounded-2xl bg-primary-soft/60 p-3 ring-1 ring-primary/15">
            <Sparkles className="size-4 text-primary" />
            <div className="flex-1 text-xs">
              <span className="font-semibold text-primary">{cheapest.network} {cheapest.size}</span> is{" "}
              <span className="font-semibold">₦{(plan.price - cheapest.price).toLocaleString()} cheaper</span>
            </div>
          </div>
        )}

        <button
          disabled={loading || !plan}
          onClick={handleBuy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-brand disabled:opacity-40"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Processing…" : plan ? `Buy for ${formatNaira(plan.price)}` : "Select a plan"}
        </button>
      </div>
    </AppShell>
  );
}
