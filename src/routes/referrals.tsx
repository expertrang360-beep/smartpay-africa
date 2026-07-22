import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import { Copy, Share2, Gift, Users, Ticket } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/referrals")({ component: Referrals });

function Referrals() {
  const { referralCode, referralEarnings, cashback } = useStore();
  const link = typeof window !== "undefined" ? `${window.location.origin}/?ref=${referralCode}` : "";

  const promos = [
    { code: "WELCOME10", desc: "10% off first data purchase", exp: "31 Dec" },
    { code: "POWER500", desc: "₦500 off electricity ≥ ₦10,000", exp: "15 Jan" },
    { code: "DSTV5", desc: "5% cashback on any DSTV plan", exp: "28 Feb" },
  ];

  return (
    <AppShell>
      <PageHeader title="Rewards" subtitle="Refer, earn, save" back="/" />
      <div className="space-y-5 px-5 pb-8">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.42_0.24_268)] p-6 text-white shadow-brand">
          <Gift className="size-6" />
          <div className="mt-3 text-lg font-bold tracking-tight">Earn ₦500 per referral</div>
          <div className="mt-1 text-xs opacity-80">Plus 1% of every transaction your friends make — forever.</div>
          <div className="mt-5 rounded-2xl bg-white/15 p-3 backdrop-blur ring-1 ring-white/20">
            <div className="text-[10px] font-semibold uppercase tracking-widest opacity-70">Your code</div>
            <div className="mt-1 font-mono text-2xl font-bold tracking-widest">{referralCode}</div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => { navigator.clipboard?.writeText(link); toast.success("Link copied"); }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-xs font-semibold text-primary"
            >
              <Copy className="size-3.5" /> Copy link
            </button>
            <button
              onClick={() => {
                if (navigator.share) navigator.share({ title: "Join Payroxa", text: `Sign up with my code ${referralCode}`, url: link });
                else { navigator.clipboard?.writeText(link); toast.success("Link copied"); }
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/15 py-2 text-xs font-semibold backdrop-blur ring-1 ring-white/20"
            >
              <Share2 className="size-3.5" /> Share
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Users} label="Referral earnings" value={formatNaira(referralEarnings)} />
          <Stat icon={Gift} label="Cashback earned" value={formatNaira(cashback)} />
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Ticket className="size-4" /> Active promo codes
          </h3>
          <div className="space-y-2">
            {promos.map((p) => (
              <div key={p.code} className="flex items-center justify-between rounded-2xl bg-surface p-4 ring-1 ring-border">
                <div>
                  <div className="font-mono text-sm font-bold text-primary">{p.code}</div>
                  <div className="text-[11px] text-muted-foreground">{p.desc}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Expires</div>
                  <div className="text-xs font-semibold">{p.exp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface p-4 ring-1 ring-border">
      <Icon className="size-4 text-primary" />
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-base font-bold tabular-nums">{value}</div>
    </div>
  );
}
