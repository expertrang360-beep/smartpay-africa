import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import { DISCOS, callProvider, type Disco } from "@/lib/mock-vtu";
import { Loader2, CheckCircle2, Zap } from "lucide-react";

export const Route = createFileRoute("/electricity")({
  component: Electricity,
});

function Electricity() {
  const navigate = useNavigate();
  const { balance, debit, updateTxn, credit, margins } = useStore();
  const [disco, setDisco] = useState<Disco>("EKEDC");
  const [meterType, setMeterType] = useState<"prepaid" | "postpaid">("prepaid");
  const [meter, setMeter] = useState("");
  const [amount, setAmount] = useState<number>(2000);
  const [customer, setCustomer] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleValidate() {
    if (meter.length < 10) return toast.error("Enter a valid meter number");
    setValidating(true);
    await new Promise((r) => setTimeout(r, 700));
    setCustomer(["ADEBAYO O.", "OKAFOR C.", "IBRAHIM M.", "OKONKWO J."][Math.floor(Math.random() * 4)]);
    setValidating(false);
  }

  async function handleBuy() {
    if (!customer) return toast.error("Validate the meter first");
    if (amount > balance) return toast.error("Insufficient balance");

    const txn = debit(amount, {
      kind: "electricity",
      title: `${disco} ${meterType}`,
      subtitle: `Meter ${meter}`,
      status: "pending",
      ref: "pending",
      meta: { disco, meter, customer },
    });
    if (!txn) return;
    setLoading(true);
    const result = await callProvider("smartbilling", { disco, meter, amount });
    setLoading(false);
    if (result.success) {
      const cashback = Math.round(amount * (margins.electricity / 100) * 0.3);
      updateTxn(txn.id, { status: "success", ref: result.ref, token: result.token, cashback });
      if (cashback > 0) credit(cashback, { kind: "cashback", title: "Cashback", subtitle: "Electricity", ref: result.ref, status: "success" });
      toast.success("Token generated successfully");
      navigate({ to: "/transactions/$id", params: { id: txn.id } });
    } else {
      updateTxn(txn.id, { status: "failed" });
      credit(amount, { kind: "fund", title: "Refund", subtitle: "Token failed", ref: result.ref, status: "success" });
      toast.error("Failed — refunded.");
    }
  }

  return (
    <AppShell>
      <PageHeader title="Electricity" subtitle="Token & postpaid — validated before charge" back="/" />
      <div className="space-y-5 px-5 pb-8">
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Disco</label>
          <select
            value={disco}
            onChange={(e) => { setDisco(e.target.value as Disco); setCustomer(null); }}
            className="mt-2 w-full rounded-2xl bg-muted/50 px-4 py-3 text-sm font-medium ring-1 ring-border outline-none focus:ring-primary"
          >
            {DISCOS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(["prepaid", "postpaid"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setMeterType(t)}
              className={`rounded-2xl py-3 text-sm font-semibold capitalize ring-1 ${
                meterType === t ? "bg-primary text-primary-foreground ring-primary" : "bg-surface ring-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Meter number</label>
          <div className="mt-2 flex gap-2">
            <input
              value={meter}
              onChange={(e) => { setMeter(e.target.value.replace(/\D/g, "").slice(0, 13)); setCustomer(null); }}
              placeholder="1234567890"
              inputMode="numeric"
              className="flex-1 rounded-2xl bg-muted/50 px-4 py-3 text-sm font-medium tabular-nums ring-1 ring-border outline-none focus:ring-primary"
            />
            <button
              onClick={handleValidate}
              disabled={validating || meter.length < 10}
              className="rounded-2xl bg-foreground px-4 text-xs font-semibold text-background disabled:opacity-40"
            >
              {validating ? <Loader2 className="size-4 animate-spin" /> : "Validate"}
            </button>
          </div>
          {customer && (
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-700 ring-1 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2 className="size-4" /> Customer: <span className="font-semibold">{customer}</span>
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Amount</label>
          <div className="mt-2 flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3 ring-1 ring-border focus-within:ring-primary">
            <span className="text-lg font-semibold text-muted-foreground">₦</span>
            <input
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")))}
              inputMode="numeric"
              className="w-full bg-transparent text-lg font-bold tabular-nums outline-none"
            />
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[1000, 2000, 5000, 10000].map((q) => (
              <button
                key={q}
                onClick={() => setAmount(q)}
                className={`rounded-xl py-1.5 text-xs font-semibold ring-1 ${
                  amount === q ? "bg-primary text-primary-foreground ring-primary" : "bg-surface ring-border"
                }`}
              >
                ₦{q.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleBuy}
          disabled={loading || !customer}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-brand disabled:opacity-40"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
          {loading ? "Generating token…" : `Buy ${formatNaira(amount)} token`}
        </button>
      </div>
    </AppShell>
  );
}
