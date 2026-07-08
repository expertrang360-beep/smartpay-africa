import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import { CABLE_PACKAGES, callProvider, type CableProvider } from "@/lib/mock-vtu";
import { Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/cable")({ component: Cable });

const PROVIDERS: CableProvider[] = ["DSTV", "GOTV", "Startimes"];

function Cable() {
  const navigate = useNavigate();
  const { balance, debit, updateTxn, credit, margins } = useStore();
  const [provider, setProvider] = useState<CableProvider>("DSTV");
  const [iuc, setIuc] = useState("");
  const [packageId, setPackageId] = useState<string | null>(null);
  const [customer, setCustomer] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [loading, setLoading] = useState(false);

  const packages = useMemo(() => CABLE_PACKAGES.filter((p) => p.provider === provider), [provider]);
  const pkg = packages.find((p) => p.id === packageId);

  async function handleValidate() {
    if (iuc.length < 8) return toast.error("Enter IUC / smartcard number");
    setValidating(true);
    await new Promise((r) => setTimeout(r, 600));
    setCustomer(["EMEKA O.", "FATIMA B.", "TOSIN A."][Math.floor(Math.random() * 3)]);
    setValidating(false);
  }

  async function handleBuy() {
    if (!pkg) return toast.error("Select a package");
    if (!customer) return toast.error("Validate IUC first");
    if (pkg.price > balance) return toast.error("Insufficient balance");

    const txn = debit(pkg.price, {
      kind: "cable",
      title: `${provider} ${pkg.name}`,
      subtitle: `IUC ${iuc}`,
      status: "pending", ref: "pending",
      meta: { provider, iuc, customer, duration: pkg.duration },
    });
    if (!txn) return;
    setLoading(true);
    const result = await callProvider("smartbilling", { provider, iuc, pkg: pkg.id });
    setLoading(false);
    if (result.success) {
      const cashback = Math.round(pkg.price * (margins.cable / 100) * 0.3);
      updateTxn(txn.id, { status: "success", ref: result.ref, cashback });
      if (cashback > 0) credit(cashback, { kind: "cashback", title: "Cashback", subtitle: "Cable TV", ref: result.ref, status: "success" });
      toast.success(`${pkg.name} activated`);
      navigate({ to: "/transactions/$id", params: { id: txn.id } });
    } else {
      updateTxn(txn.id, { status: "failed" });
      credit(pkg.price, { kind: "fund", title: "Refund", subtitle: "Cable failed", ref: result.ref, status: "success" });
      toast.error("Failed — refunded.");
    }
  }

  return (
    <AppShell>
      <PageHeader title="Cable TV" subtitle="DSTV · GOTV · Startimes" back="/" />
      <div className="space-y-5 px-5 pb-8">
        <div className="grid grid-cols-3 gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p}
              onClick={() => { setProvider(p); setPackageId(null); setCustomer(null); }}
              className={`rounded-2xl py-3 text-xs font-bold ring-1 ${
                provider === p ? "bg-primary text-primary-foreground ring-primary" : "bg-surface ring-border"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">IUC / Smartcard</label>
          <div className="mt-2 flex gap-2">
            <input
              value={iuc}
              onChange={(e) => { setIuc(e.target.value.replace(/\D/g, "").slice(0, 12)); setCustomer(null); }}
              inputMode="numeric"
              placeholder="1234567890"
              className="flex-1 rounded-2xl bg-muted/50 px-4 py-3 text-sm font-medium tabular-nums ring-1 ring-border outline-none focus:ring-primary"
            />
            <button
              onClick={handleValidate}
              disabled={validating || iuc.length < 8}
              className="rounded-2xl bg-foreground px-4 text-xs font-semibold text-background disabled:opacity-40"
            >
              {validating ? <Loader2 className="size-4 animate-spin" /> : "Validate"}
            </button>
          </div>
          {customer && (
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-700 ring-1 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2 className="size-4" /> {customer}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Package</label>
          <div className="mt-2 space-y-2">
            {packages.map((p) => {
              const active = pkg?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPackageId(p.id)}
                  className={`flex w-full items-center justify-between rounded-2xl p-4 text-left ring-1 ${
                    active ? "bg-primary-soft ring-primary" : "bg-surface ring-border"
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.duration}</div>
                  </div>
                  <div className={`text-sm font-bold tabular-nums ${active ? "text-primary" : ""}`}>
                    ₦{p.price.toLocaleString()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleBuy}
          disabled={loading || !pkg || !customer}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-brand disabled:opacity-40"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Processing…" : pkg ? `Renew for ${formatNaira(pkg.price)}` : "Select package"}
        </button>
      </div>
    </AppShell>
  );
}
