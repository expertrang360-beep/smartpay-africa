import { Link } from "@tanstack/react-router";
import {
  ArrowLeftRight, Phone, Wifi, Zap, Tv, Globe, Ticket, Gift, QrCode, Link2,
  type LucideIcon,
} from "lucide-react";
import { Card, CardHeader } from "./Card";

const actions: { to: string; label: string; icon: LucideIcon; tone: string }[] = [
  { to: "/transfers", label: "Transfer", icon: ArrowLeftRight, tone: "bg-primary-soft text-primary" },
  { to: "/airtime", label: "Airtime", icon: Phone, tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  { to: "/data", label: "Data", icon: Wifi, tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  { to: "/electricity", label: "Electricity", icon: Zap, tone: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300" },
  { to: "/cable", label: "Cable TV", icon: Tv, tone: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
  { to: "/bills", label: "Internet", icon: Globe, tone: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300" },
  { to: "/bills", label: "Betting", icon: Ticket, tone: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300" },
  { to: "/bills", label: "Gift Cards", icon: Gift, tone: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300" },
  { to: "/transfers", label: "QR Pay", icon: QrCode, tone: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" },
  { to: "/transfers", label: "Payment Link", icon: Link2, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader title="Quick actions" subtitle="Everything you can do — one tap away" />
      <div className="grid grid-cols-5 gap-2 p-4 sm:grid-cols-5 md:grid-cols-10">
        {actions.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="group flex flex-col items-center gap-2 rounded-xl border border-transparent p-2 transition-all hover:border-border hover:bg-muted/50"
          >
            <div className={`grid size-11 place-items-center rounded-xl transition-transform group-active:scale-95 ${a.tone}`}>
              <a.icon className="size-5" strokeWidth={2.2} />
            </div>
            <span className="text-center text-[10px] font-semibold leading-tight text-foreground">{a.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
