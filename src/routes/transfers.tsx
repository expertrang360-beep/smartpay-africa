import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftRight, Users, QrCode, Link2, Send, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { AppShell, PageHeader, PageContainer } from "@/components/AppShell";
import { Card, CardHeader, Badge } from "@/components/payroxa/Card";
import { formatNaira } from "@/lib/format";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/transfers")({
  head: () => ({
    meta: [
      { title: "Transfers — Payroxa" },
      { name: "description", content: "Send money to any Nigerian bank instantly, manage beneficiaries, share QR codes and payment links." },
      { property: "og:title", content: "Payroxa Transfers" },
      { property: "og:description", content: "Instant bank transfers, beneficiaries, QR pay and shareable payment links." },
    ],
  }),
  component: TransfersPage,
});

const banks = ["GTBank", "Access Bank", "Zenith Bank", "First Bank", "UBA", "Kuda", "Opay", "Palmpay", "Fidelity", "Wema", "Sterling"];

function TransfersPage() {
  const { beneficiaries, balance } = useStore();
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState(banks[0]);
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [step, setStep] = useState<"form" | "review" | "pin" | "success">("form");
  const [pin, setPin] = useState("");

  const canReview = /^\d{10}$/.test(account) && Number(amount) > 0 && Number(amount) <= balance;

  return (
    <AppShell>
      <PageHeader
        title="Transfers"
        subtitle="Send to any Nigerian bank in seconds"
        icon={ArrowLeftRight}
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold hover:bg-muted"><QrCode className="size-4" /> QR pay</button>
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold hover:bg-muted"><Link2 className="size-4" /> Payment link</button>
          </>
        }
      />
      <PageContainer className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title={step === "form" ? "New transfer" : step === "review" ? "Review transfer" : step === "pin" ? "Enter PIN" : "Transfer complete"} icon={Send} />
          <div className="space-y-5 p-6">
            {step === "form" && (
              <>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold">Bank</label>
                  <select value={bank} onChange={(e) => setBank(e.target.value)} className="h-11 rounded-xl border border-border bg-surface px-3 text-sm">
                    {banks.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold">Account number</label>
                  <input value={account} onChange={(e) => setAccount(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="0123456789" className="h-11 rounded-xl border border-border bg-surface px-3 font-mono text-sm tabular-nums" />
                  {account.length === 10 && <div className="text-xs font-semibold text-emerald-600">✓ ADA OKORO · {bank}</div>}
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold">Amount (₦)</label>
                  <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} placeholder="0.00" className="h-14 rounded-xl border border-border bg-surface px-3 text-2xl font-bold tabular-nums" />
                  <div className="text-xs text-muted-foreground">Balance {formatNaira(balance)}</div>
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold">Narration (optional)</label>
                  <input value={narration} onChange={(e) => setNarration(e.target.value)} placeholder="What's it for?" className="h-11 rounded-xl border border-border bg-surface px-3 text-sm" />
                </div>
                <button
                  disabled={!canReview}
                  onClick={() => setStep("review")}
                  className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-brand disabled:opacity-40"
                >
                  Continue
                </button>
              </>
            )}

            {step === "review" && (
              <div className="space-y-4">
                <dl className="divide-y divide-border rounded-xl border border-border bg-muted/30 text-sm">
                  {[
                    ["Recipient", "ADA OKORO"], ["Bank", bank], ["Account", account],
                    ["Amount", formatNaira(Number(amount))], ["Fee", "Free"],
                    ["Total", formatNaira(Number(amount))],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-2 gap-2 p-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
                  ))}
                </dl>
                <div className="flex gap-3">
                  <button onClick={() => setStep("form")} className="h-12 flex-1 rounded-xl border border-border text-sm font-semibold">Back</button>
                  <button onClick={() => setStep("pin")} className="h-12 flex-1 rounded-xl bg-primary text-sm font-semibold text-primary-foreground">Confirm</button>
                </div>
              </div>
            )}

            {step === "pin" && (
              <div className="space-y-4 text-center">
                <ShieldCheck className="mx-auto size-10 text-primary" />
                <div>
                  <div className="text-sm font-semibold">Enter your 4-digit PIN</div>
                  <p className="mt-1 text-xs text-muted-foreground">This authorizes the transfer instantly.</p>
                </div>
                <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))} className="mx-auto h-14 w-40 rounded-xl border border-border bg-surface text-center text-2xl font-bold tracking-[0.5em] tabular-nums" />
                <button onClick={() => { if (pin === "1234") { setStep("success"); toast.success("Transfer sent"); } else toast.error("Wrong PIN"); }} disabled={pin.length !== 4} className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-40">Authorize</button>
              </div>
            )}

            {step === "success" && (
              <div className="space-y-3 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">✓</div>
                <div className="text-lg font-bold">Sent {formatNaira(Number(amount))}</div>
                <p className="text-xs text-muted-foreground">to ADA OKORO · {bank} · {account}</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => { setStep("form"); setAmount(""); setAccount(""); setPin(""); }} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">New transfer</button>
                  <Link to="/transactions" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">View receipt</Link>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Beneficiaries" subtitle={`${beneficiaries.length} saved`} icon={Users} action={<Badge tone="primary">Sync</Badge>} />
            <ul className="divide-y divide-border">
              {beneficiaries.map((b) => (
                <li key={b.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4">
                  <div className={`grid size-10 place-items-center rounded-full text-sm font-bold text-white ${b.avatarColor}`}>{b.name.split(" ").map(n => n[0]).slice(0,2).join("")}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{b.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{b.bank} · {b.account}</div>
                  </div>
                  <button onClick={() => { setAccount(b.account); setBank(b.bank); }} className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold hover:bg-muted">Send</button>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Payment links" subtitle="Get paid without asking for account details" />
            <div className="space-y-3 p-5">
              <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                <QrCode className="mx-auto mb-2 size-8 text-primary" />
                Scan or share <span className="font-mono font-semibold text-foreground">pay.roxa/chidi25</span>
              </div>
              <button className="h-10 w-full rounded-xl bg-foreground text-sm font-semibold text-background">Copy link</button>
            </div>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  );
}
