import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, ShieldCheck, Smartphone, KeyRound, Palette, Globe, Bell, Fingerprint, Code2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { AppShell, PageHeader, PageContainer } from "@/components/AppShell";
import { Card, CardHeader, Badge } from "@/components/payroxa/Card";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Payroxa" },
      { name: "description", content: "Manage your Payroxa profile, security, notifications, appearance, API keys and connected devices." },
      { property: "og:title", content: "Payroxa Settings" },
      { property: "og:description", content: "Profile, security, appearance, notifications, API keys and devices." },
    ],
  }),
  component: SettingsPage,
});

function Toggle({ on }: { on: boolean }) {
  return (
    <span className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full ${on ? "bg-primary" : "bg-muted"}`}>
      <span className={`size-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
    </span>
  );
}

function Row({ icon: Icon, label, hint, right }: { icon: LucideIcon; label: string; hint?: string; right: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4">
      <div className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground"><Icon className="size-4" /></div>
      <div className="min-w-0"><div className="truncate text-sm font-semibold">{label}</div>{hint && <div className="truncate text-xs text-muted-foreground">{hint}</div>}</div>
      <div>{right}</div>
    </li>
  );
}

function SettingsPage() {
  const { name, email, phone, darkMode, toggleDark, smartMode, toggleSmart, level, kycProgress } = useStore();
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <AppShell>
      <PageHeader title="Settings" subtitle="Manage account, security and preferences" icon={SettingsIcon} />
      <PageContainer className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Card>
          <CardHeader title="Profile" />
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white">{initials}</div>
            <div>
              <div className="text-lg font-bold">{name}</div>
              <div className="text-xs text-muted-foreground">{email}</div>
              <div className="text-xs text-muted-foreground">{phone}</div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge tone="success"><ShieldCheck className="mr-1 inline size-3" /> Tier 3 · {kycProgress}%</Badge>
              <Badge tone="primary">{level} member</Badge>
            </div>
            <button className="mt-3 h-10 w-full rounded-xl border border-border text-sm font-semibold">Edit profile</button>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Security" icon={ShieldCheck} />
            <ul className="divide-y divide-border">
              <Row icon={KeyRound} label="Change password" hint="Last changed 3 months ago" right={<button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold">Update</button>} />
              <Row icon={Fingerprint} label="Biometric login" hint="Face ID · Touch ID" right={<Toggle on />} />
              <Row icon={Smartphone} label="2-factor authentication" hint="SMS + Authenticator" right={<Toggle on />} />
              <Row icon={Smartphone} label="Trusted devices" hint="3 active devices" right={<button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold">Manage</button>} />
            </ul>
          </Card>

          <Card>
            <CardHeader title="Preferences" icon={Palette} />
            <ul className="divide-y divide-border">
              <Row icon={Palette} label="Dark mode" hint="Auto follows system" right={<button onClick={toggleDark}><Toggle on={darkMode} /></button>} />
              <Row icon={Globe} label="Language" hint="English (Nigeria)" right={<button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold">Change</button>} />
              <Row icon={Globe} label="Currency" hint="NGN — Naira" right={<button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold">Change</button>} />
              <Row icon={Bell} label="Notification preferences" hint="Push, email, SMS" right={<button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold">Configure</button>} />
              <Row icon={SettingsIcon} label="Smart Mode auto-routing" hint="Pick cheapest & fastest provider" right={<button onClick={toggleSmart}><Toggle on={smartMode} /></button>} />
            </ul>
          </Card>

          <Card>
            <CardHeader title="Developer" icon={Code2} action={<Badge tone="info">Beta</Badge>} />
            <ul className="divide-y divide-border">
              <Row icon={Code2} label="API keys" hint="1 live key · 2 sandbox" right={<button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold">Manage</button>} />
              <Row icon={Code2} label="Webhooks" hint="2 endpoints registered" right={<button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold">Configure</button>} />
              <Row icon={Code2} label="Rate limits" hint="1,000 req/min · Growth tier" right={<Badge tone="neutral">Growth</Badge>} />
            </ul>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  );
}
