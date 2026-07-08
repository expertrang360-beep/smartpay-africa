import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Loader2, Building2, CreditCard } from "lucide-react";

export const Route = createFileRoute("/wallet/fund")({ component: Fund });

function Fund() {
  const navigate = useNavigate();
  const { credit } = useStore();
  const [amount, setAmount] = useState<number>(5000);
  const [method, setMethod] = useState<"paystack" | "flutterwave" | "transfer">("paystack");
  const [loading, setLoading] = useState(false);

  async function handleFund() {
    if (amount < 100) return toast.error("Minimum ₦100");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    credit(amount, {
      kind: "fund",
      title: "Wallet funding",
      subtitle: method === "paystack" ? "Paystack" : method === "flutterwave" ? "Flutterwave" : "Bank transfer",
      status: "success",
      ref: "SP" + Math.random().toString(36).slice(2, 10).toUpperCase(),
    });
    setLoading(false);
    toast.success(`₦${amount.toLocaleString()} added to wallet`);
    navigate({ to: "/wallet" });
  }

  const methods = [
    { id: "paystack" as const, name: "Paystack Card", desc: "Instant · 1.5% fee", icon: CreditCard },
    { id: "flutterwave" as const, name: "Flutterwave", desc: "Card & bank · 1.4% fee", icon: CreditCard },
    { id: "transfer" as const, name: "Bank transfer", desc: "Virtual account · Free", icon: Building2 },
  ];

  return (
    <AppShell>
      <PageHeader title="Fund wallet" back="/wallet" />
      <div className="space-y-5 px-5 pb-8">
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Amount</label>
          <div className="mt-2 flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-4 ring-1 ring-border focus-within:ring-primary">
            <span className="text-2xl font-semibold text-muted-foreground">₦</span>
            <input
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")))}
              inputMode="numeric"
              className="w-full bg-transparent text-2xl font-bold tabular-nums outline-none"
            />
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[1000, 5000, 10000, 20000].map((q) => (
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

        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Method</label>
          <div className="mt-2 space-y-2">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex w-full items-center gap-3 rounded-2xl p-4 ring-1 ${
                  method === m.id ? "bg-primary-soft ring-primary" : "bg-surface ring-border"
                }`}
              >
                <div className={`grid size-10 place-items-center rounded-xl ${method === m.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <m.icon className="size-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="text-[11px] text-muted-foreground">{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleFund}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-brand disabled:opacity-40"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Confirming…" : `Fund ₦${amount.toLocaleString()}`}
        </button>

        <p className="text-center text-[10px] text-muted-foreground">
          Demo mode — no real charges. Wire real Paystack/Flutterwave later.
        </p>
      </div>
    </AppShell>
  );
}
