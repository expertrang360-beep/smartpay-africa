import { Link, useLocation } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Wallet, ArrowLeftRight, ReceiptText, CreditCard, Gift, Store,
  Briefcase, LineChart, LifeBuoy, Settings, LogOut, Moon, Sun, Bell, Search,
  ChevronLeft, ChevronRight, Home, Activity, User, ShieldCheck, Menu, X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";

const primaryNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/transfers", label: "Transfers", icon: ArrowLeftRight },
  { to: "/bills", label: "Bills", icon: ReceiptText },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/rewards", label: "Rewards", icon: Gift },
];
const secondaryNav = [
  { to: "/merchants", label: "Merchants", icon: Store },
  { to: "/business", label: "Business", icon: Briefcase },
  { to: "/analytics", label: "Analytics", icon: LineChart },
];
const footerNav = [
  { to: "/support", label: "Support", icon: LifeBuoy },
  { to: "/settings", label: "Settings", icon: Settings },
];

const mobileNav = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/bills", label: "Pay", icon: ReceiptText },
  { to: "/transactions", label: "Activity", icon: Activity },
  { to: "/settings", label: "Profile", icon: User },
];

function useActive(to: string, exact = false) {
  const { pathname } = useLocation();
  if (exact) return pathname === to;
  return pathname === to || pathname.startsWith(to + "/");
}

function NavItem({
  to, label, icon: Icon, collapsed, exact,
}: { to: string; label: string; icon: typeof Home; collapsed: boolean; exact?: boolean }) {
  const active = useActive(to, exact);
  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      aria-label={label}
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={active ? 2.4 : 2} />
      {!collapsed && <span className="truncate">{label}</span>}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-semibold text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block">
          {label}
        </span>
      )}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { name, email, darkMode, toggleDark, notifications, balanceHidden } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div className="flex min-h-dvh w-full bg-background text-foreground">
      {/* Sidebar (desktop) */}
      <aside
        className={`sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 md:flex ${
          collapsed ? "w-[76px]" : "w-[248px]"
        }`}
      >
        <div className={`flex h-16 items-center gap-2 border-b border-border px-4 ${collapsed ? "justify-center px-0" : ""}`}>
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-brand">
            <span className="text-sm font-black">P</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[15px] font-bold tracking-tight">Payroxa</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Enterprise</div>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {!collapsed && <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Main</div>}
            {primaryNav.map((n) => <NavItem key={n.to} {...n} collapsed={collapsed} />)}
          </div>
          <div className="space-y-1">
            {!collapsed && <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Workspace</div>}
            {secondaryNav.map((n) => <NavItem key={n.to} {...n} collapsed={collapsed} />)}
          </div>
        </nav>

        <div className="space-y-1 border-t border-border p-3">
          {footerNav.map((n) => <NavItem key={n.to} {...n} collapsed={collapsed} />)}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="size-4" /> : (<><ChevronLeft className="size-4" /> Collapse</>)}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative flex h-full w-72 flex-col bg-surface shadow-elevated">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-black">P</span>
                </div>
                <span className="font-bold">Payroxa</span>
              </div>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X className="size-5" /></button>
            </div>
            <nav className="flex-1 space-y-4 overflow-y-auto p-3" onClick={() => setMobileOpen(false)}>
              {[...primaryNav, ...secondaryNav, ...footerNav].map((n) => (
                <NavItem key={n.to} {...n} collapsed={false} />
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <button
            className="grid size-9 place-items-center rounded-lg border border-border md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          <div className="hidden min-w-0 flex-1 md:block">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search transactions, contacts, merchants…"
                className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-16 text-sm outline-none ring-primary/20 placeholder:text-muted-foreground focus:ring-2"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground lg:inline">⌘K</kbd>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={toggleDark}
              aria-label="Toggle theme"
              className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link
              to="/support"
              aria-label={`Notifications, ${unread} unread`}
              className="relative grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Bell className="size-4" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Link>
            <Link to="/settings" className="ml-1 flex items-center gap-2 rounded-xl border border-border bg-surface p-1 pr-3 hover:bg-muted">
              <div className="grid size-7 place-items-center rounded-lg bg-primary-soft text-xs font-bold text-primary">{initials}</div>
              <div className="hidden text-left leading-tight sm:block">
                <div className="text-xs font-semibold">{name}</div>
                <div className="text-[10px] text-muted-foreground">{balanceHidden ? "•••" : formatNaira(useStore.getState().balance, { compact: true })}</div>
              </div>
            </Link>
          </div>
        </header>

        <main className="min-w-0 flex-1 pb-24 md:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {mobileNav.map((n) => {
            const active = useActive(n.to, n.exact);
            return (
              <Link key={n.to} to={n.to} className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
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

export function PageHeader({
  title, subtitle, back, actions, icon: Icon,
}: {
  title: string; subtitle?: string; back?: string; actions?: ReactNode; icon?: typeof Home;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border px-4 py-6 md:px-8 md:py-8">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Icon className="size-5" />
          </div>
        )}
        <div className="min-w-0">
          {back && (
            <Link to={back} className="mb-1 inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground">
              ← Back
            </Link>
          )}
          <h1 className="truncate text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center justify-end gap-2">{actions}</div>}
    </header>
  );
}

export function PageContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-6 md:px-8 md:py-8 ${className}`}>{children}</div>;
}

export { ShieldCheck, LogOut };
