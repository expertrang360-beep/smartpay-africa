import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Home, Receipt, Users, LayoutDashboard, Wallet, Moon, Sun, LogOut, Zap,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/transactions", label: "History", icon: Receipt },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/referrals", label: "Rewards", icon: Users },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { name, balance, smartMode, darkMode, toggleDark, toggleSmart, isAdmin } = useStore();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1400px] lg:gap-6 lg:px-6 lg:py-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 flex-col lg:flex">
          <div className="mb-10 flex items-center gap-2 px-2">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-brand">
              <Zap className="size-5" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">Smartpay</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Fintech Core</div>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {nav.map((n) => {
              const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary-soft text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <n.icon className="size-4" />
                  {n.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                className={`mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname.startsWith("/admin")
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <LayoutDashboard className="size-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="mt-auto space-y-3 rounded-2xl bg-surface p-4 ring-1 ring-border">
            <button
              onClick={toggleSmart}
              className="flex w-full items-center justify-between text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                Smart Mode
              </span>
              <span
                className={`inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  smartMode ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`size-4 rounded-full bg-white shadow transition-transform ${
                    smartMode ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>
            <button
              onClick={toggleDark}
              className="flex w-full items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {darkMode ? "Light mode" : "Dark mode"}
            </button>
            <button className="flex w-full items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive">
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main phone-frame */}
        <main className="flex-1 pb-24 lg:pb-6">
          <div className="mx-auto min-h-[calc(100vh-3rem)] w-full max-w-[440px] bg-surface shadow-none lg:rounded-3xl lg:shadow-elevated lg:ring-1 lg:ring-border">
            {children}
          </div>
        </main>

        {/* Desktop right column: quick balance */}
        <aside className="hidden w-72 shrink-0 flex-col gap-4 xl:flex">
          <div className="rounded-2xl bg-surface p-5 ring-1 ring-border shadow-card">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Signed in</div>
            <div className="mt-1 text-base font-semibold">{name}</div>
            <div className="mt-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">Balance</div>
            <div className="text-2xl font-bold tabular-nums tracking-tight">{formatNaira(balance)}</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.5_0.24_265)] p-5 text-white shadow-brand">
            <div className="text-xs font-medium uppercase tracking-widest opacity-80">Smart mode</div>
            <div className="mt-1 text-sm font-medium opacity-90">
              We auto-route every transaction to the cheapest and fastest available provider.
            </div>
            <button
              onClick={toggleSmart}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur ring-1 ring-white/20"
            >
              {smartMode ? "Enabled" : "Disabled"} · toggle
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {nav.map((n) => {
            const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-semibold transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <n.icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle, back }: { title: string; subtitle?: string; back?: string }) {
  return (
    <header className="px-5 pb-4 pt-8">
      {back && (
        <Link to={back} className="mb-3 inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
      )}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </header>
  );
}
