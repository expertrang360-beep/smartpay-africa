import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, MessageCircle, Mail, Phone, ChevronDown, Bell } from "lucide-react";
import { AppShell, PageHeader, PageContainer } from "@/components/AppShell";
import { Card, CardHeader, Badge } from "@/components/payroxa/Card";
import { NotificationsCard } from "@/components/payroxa/NotificationsCard";
import { useState } from "react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Notifications — Payroxa" },
      { name: "description", content: "Get help fast: live chat, ticket status, FAQs and system notifications from Payroxa." },
      { property: "og:title", content: "Payroxa Support" },
      { property: "og:description", content: "Support tickets, live chat and account notifications." },
    ],
  }),
  component: SupportPage,
});

const faqs = [
  { q: "How does Smart Mode routing work?", a: "Smart Mode scores every provider on cost, speed and uptime, then routes each transaction to the best one automatically." },
  { q: "How long do withdrawals take?", a: "Instant for verified accounts. First withdrawal of a new bank may take up to 10 minutes." },
  { q: "How is my money protected?", a: "Funds are held with tier-1 partner banks and secured with 256-bit encryption plus device biometrics." },
  { q: "Can I have multiple virtual cards?", a: "Yes — up to 5 Naira cards and 3 USD cards, freezable at any time." },
];

function SupportPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <AppShell>
      <PageHeader title="Support & notifications" subtitle="We reply in under 90 seconds" icon={LifeBuoy}
        actions={<Badge tone="success">All systems normal</Badge>}
      />
      <PageContainer className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Get in touch" />
            <div className="grid gap-3 p-5 sm:grid-cols-3">
              {[
                { icon: MessageCircle, label: "Live chat", meta: "Avg 42s", tone: "bg-primary-soft text-primary" },
                { icon: Mail, label: "Email us", meta: "help@payroxa.ng", tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
                { icon: Phone, label: "Call 24/7", meta: "0700-PAYROXA", tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
              ].map((c) => (
                <button key={c.label} className="flex flex-col items-start gap-2 rounded-2xl border border-border p-4 text-left hover:border-primary/40">
                  <div className={`grid size-10 place-items-center rounded-xl ${c.tone}`}><c.icon className="size-5" /></div>
                  <div className="text-sm font-semibold">{c.label}</div>
                  <div className="text-xs text-muted-foreground">{c.meta}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="FAQs" subtitle="Answers to common questions" />
            <ul className="divide-y divide-border">
              {faqs.map((f, i) => (
                <li key={f.q}>
                  <button onClick={() => setOpen(open === i ? null : i)} className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 text-left" aria-expanded={open === i}>
                    <span className="text-sm font-semibold">{f.q}</span>
                    <ChevronDown className={`size-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                  </button>
                  {open === i && <div className="px-4 pb-4 text-xs text-muted-foreground">{f.a}</div>}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Your tickets" icon={LifeBuoy} action={<button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">New ticket</button>} />
            <div className="p-10 text-center text-sm text-muted-foreground">
              <Bell className="mx-auto mb-3 size-10 opacity-30" />
              You have no open tickets. Nice.
            </div>
          </Card>
        </div>

        <NotificationsCard limit={10} />
      </PageContainer>
    </AppShell>
  );
}
