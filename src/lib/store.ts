import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TxnStatus = "success" | "pending" | "failed";
export type TxnKind =
  | "airtime" | "data" | "electricity" | "cable" | "internet" | "betting" | "giftcard"
  | "transfer" | "fund" | "withdraw" | "cashback" | "referral" | "bonus" | "card";

export interface Transaction {
  id: string;
  kind: TxnKind;
  amount: number;
  status: TxnStatus;
  createdAt: number;
  title: string;
  subtitle?: string;
  ref: string;
  category?: string;
  meta?: Record<string, string | number>;
  providerId?: string;
  providerName?: string;
  token?: string;
  cashback?: number;
}

export interface FrequentContact {
  id: string;
  phone: string;
  network: string;
  lastUsed: number;
  count: number;
}

export interface VirtualCard {
  id: string;
  label: string;
  last4: string;
  network: "Visa" | "Mastercard" | "Verve";
  balance: number;
  currency: "NGN" | "USD";
  frozen: boolean;
  expiry: string;
  color: "midnight" | "emerald" | "amber" | "royal";
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  priority: "info" | "success" | "warning" | "critical";
  category: "transaction" | "security" | "system" | "promo";
}

export interface Merchant {
  id: string;
  name: string;
  logo: string;
  category: string;
  volume: number;
  revenue: number;
  pending: number;
  todaySales: number;
}

export interface Beneficiary {
  id: string;
  name: string;
  account: string;
  bank: string;
  avatarColor: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Finance" | "Support" | "Analyst";
  department: string;
  status: "active" | "invited" | "suspended";
  permission: "full" | "read" | "custom";
}

export interface UserState {
  name: string;
  email: string;
  phone: string;
  pin: string;
  balance: number;
  pendingBalance: number;
  cashback: number;
  prxPoints: number;
  level: "Bronze" | "Silver" | "Gold" | "Platinum";
  currency: "NGN";
  balanceHidden: boolean;
  referralCode: string;
  referralEarnings: number;
  transactions: Transaction[];
  frequent: FrequentContact[];
  cards: VirtualCard[];
  notifications: Notification[];
  merchants: Merchant[];
  beneficiaries: Beneficiary[];
  team: TeamMember[];
  smartMode: boolean;
  darkMode: boolean;
  isAdmin: boolean;
  kycProgress: number;
  services: { airtime: boolean; data: boolean; electricity: boolean; cable: boolean; internet: boolean; betting: boolean; giftcards: boolean };
  margins: { airtime: number; data: number; electricity: number; cable: number };
}

interface Actions {
  setUser: (patch: Partial<UserState>) => void;
  credit: (amount: number, txn: Omit<Transaction, "amount" | "id" | "createdAt">) => void;
  debit: (amount: number, txn: Omit<Transaction, "amount" | "id" | "createdAt">) => Transaction | null;
  addTxn: (txn: Omit<Transaction, "id" | "createdAt">) => Transaction;
  updateTxn: (id: string, patch: Partial<Transaction>) => void;
  bumpFrequent: (phone: string, network: string) => void;
  toggleSmart: () => void;
  toggleDark: () => void;
  toggleHideBalance: () => void;
  toggleService: (key: keyof UserState["services"]) => void;
  setMargin: (key: keyof UserState["margins"], value: number) => void;
  markNotificationsRead: () => void;
  freezeCard: (id: string) => void;
  reset: () => void;
}

const genRef = () => "PRX" + Math.random().toString(36).slice(2, 10).toUpperCase();
const genId = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);

const seed: UserState = {
  name: "Chidi Obi",
  email: "chidi@payroxa.ng",
  phone: "08031234567",
  pin: "1234",
  balance: 1_425_000,
  pendingBalance: 48_500,
  cashback: 18_540,
  prxPoints: 3820,
  level: "Gold",
  currency: "NGN",
  balanceHidden: false,
  referralCode: "CHIDI25",
  referralEarnings: 45_000,
  smartMode: true,
  darkMode: false,
  isAdmin: true,
  kycProgress: 85,
  services: { airtime: true, data: true, electricity: true, cable: true, internet: true, betting: true, giftcards: true },
  margins: { airtime: 2, data: 3, electricity: 1.5, cable: 2.5 },
  frequent: [
    { id: "1", phone: "08031234567", network: "MTN", lastUsed: Date.now() - 3600e3, count: 8 },
    { id: "2", phone: "08021234567", network: "Airtel", lastUsed: Date.now() - 86400e3, count: 3 },
    { id: "3", phone: "08051234567", network: "Glo", lastUsed: Date.now() - 172800e3, count: 2 },
  ],
  beneficiaries: [
    { id: "b1", name: "Ada Okoro", account: "0123456789", bank: "GTBank", avatarColor: "bg-rose-500" },
    { id: "b2", name: "Ifeanyi Uche", account: "9876543210", bank: "Access Bank", avatarColor: "bg-sky-500" },
    { id: "b3", name: "Zainab Bello", account: "1122334455", bank: "Zenith Bank", avatarColor: "bg-emerald-500" },
    { id: "b4", name: "Tunde Balogun", account: "5544332211", bank: "UBA", avatarColor: "bg-amber-500" },
  ],
  cards: [
    { id: "c1", label: "Personal", last4: "4021", network: "Visa", balance: 420000, currency: "NGN", frozen: false, expiry: "09/28", color: "midnight" },
    { id: "c2", label: "Business USD", last4: "8890", network: "Mastercard", balance: 1250, currency: "USD", frozen: false, expiry: "12/27", color: "emerald" },
    { id: "c3", label: "Subscriptions", last4: "5512", network: "Verve", balance: 25000, currency: "NGN", frozen: true, expiry: "04/29", color: "amber" },
  ],
  notifications: [
    { id: "n1", title: "Transfer received", body: "₦120,000 from Ada Okoro settled to your wallet.", createdAt: Date.now() - 600e3, read: false, priority: "success", category: "transaction" },
    { id: "n2", title: "New sign-in from Lagos", body: "We detected a login on Chrome, MacOS. Was this you?", createdAt: Date.now() - 5400e3, read: false, priority: "warning", category: "security" },
    { id: "n3", title: "Bill due tomorrow", body: "EKEDC prepaid meter · usual amount ₦15,000.", createdAt: Date.now() - 43200e3, read: false, priority: "info", category: "system" },
    { id: "n4", title: "You reached Gold tier", body: "Unlocked 1.5% cashback on all bill payments.", createdAt: Date.now() - 172800e3, read: true, priority: "success", category: "promo" },
  ],
  merchants: [
    { id: "m1", name: "Kola Foods", logo: "KF", category: "Restaurant", volume: 3_240_000, revenue: 412_000, pending: 68_500, todaySales: 128_400 },
    { id: "m2", name: "Zola Fashion", logo: "ZF", category: "Retail", volume: 1_850_000, revenue: 278_000, pending: 32_100, todaySales: 74_200 },
    { id: "m3", name: "Verde Tech", logo: "VT", category: "SaaS", volume: 4_960_000, revenue: 890_000, pending: 155_400, todaySales: 210_800 },
  ],
  team: [
    { id: "u1", name: "Chidi Obi", email: "chidi@payroxa.ng", role: "Owner", department: "Executive", status: "active", permission: "full" },
    { id: "u2", name: "Ada Okoro", email: "ada@payroxa.ng", role: "Finance", department: "Finance", status: "active", permission: "custom" },
    { id: "u3", name: "Ifeanyi Uche", email: "ify@payroxa.ng", role: "Admin", department: "Operations", status: "active", permission: "full" },
    { id: "u4", name: "Zainab Bello", email: "zainab@payroxa.ng", role: "Support", department: "CX", status: "invited", permission: "read" },
    { id: "u5", name: "Tunde Balogun", email: "tunde@payroxa.ng", role: "Analyst", department: "Data", status: "suspended", permission: "read" },
  ],
  transactions: [
    { id: "t1", kind: "airtime", amount: -2000, status: "success", createdAt: Date.now() - 3600e3, title: "MTN Airtime", subtitle: "0803 123 ****", category: "Airtime", ref: genRef(), cashback: 20 },
    { id: "t2", kind: "electricity", amount: -15000, status: "success", createdAt: Date.now() - 86400e3, title: "EKEDC Token", subtitle: "Meter 452103998", category: "Bills", ref: genRef(), token: "1234-5678-9012-3456-7890" },
    { id: "t3", kind: "data", amount: -2450, status: "pending", createdAt: Date.now() - 43200e3, title: "MTN 5GB", subtitle: "0803 123 ****", category: "Data", ref: genRef() },
    { id: "t4", kind: "fund", amount: 500000, status: "success", createdAt: Date.now() - 172800e3, title: "Wallet Funding", subtitle: "Paystack transfer", category: "Wallet", ref: genRef() },
    { id: "t5", kind: "cable", amount: -9300, status: "success", createdAt: Date.now() - 259200e3, title: "DSTV Confam", subtitle: "IUC 1022394882", category: "Bills", ref: genRef() },
    { id: "t6", kind: "referral", amount: 500, status: "success", createdAt: Date.now() - 345600e3, title: "Referral Bonus", subtitle: "@ada_okoro joined", category: "Rewards", ref: genRef() },
    { id: "t7", kind: "transfer", amount: -120000, status: "success", createdAt: Date.now() - 210000e3, title: "Transfer to Ifeanyi", subtitle: "Access Bank · 9876543210", category: "Transfer", ref: genRef() },
    { id: "t8", kind: "giftcard", amount: -18500, status: "failed", createdAt: Date.now() - 400000e3, title: "Amazon Gift Card", subtitle: "$25 · USD", category: "Gift Cards", ref: genRef() },
    { id: "t9", kind: "betting", amount: -5000, status: "success", createdAt: Date.now() - 500000e3, title: "Bet9ja top-up", subtitle: "User 84920", category: "Betting", ref: genRef() },
    { id: "t10", kind: "internet", amount: -22000, status: "success", createdAt: Date.now() - 600000e3, title: "Spectranet 30GB", subtitle: "Account 88301", category: "Internet", ref: genRef() },
  ],
};

export const useStore = create<UserState & Actions>()(
  persist(
    (set, get) => ({
      ...seed,
      setUser: (patch) => set(patch),
      credit: (amount, base) =>
        set((s) => ({
          balance: s.balance + amount,
          transactions: [{ ...base, amount, id: genId(), createdAt: Date.now() }, ...s.transactions],
        })),
      debit: (amount, base) => {
        const s = get();
        if (s.balance < amount) return null;
        const txn: Transaction = { ...base, amount: -amount, id: genId(), createdAt: Date.now() };
        set({ balance: s.balance - amount, transactions: [txn, ...s.transactions] });
        return txn;
      },
      addTxn: (base) => {
        const txn: Transaction = { ...base, id: genId(), createdAt: Date.now() };
        set((s) => ({ transactions: [txn, ...s.transactions] }));
        return txn;
      },
      updateTxn: (id, patch) =>
        set((s) => ({ transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      bumpFrequent: (phone, network) =>
        set((s) => {
          const existing = s.frequent.find((f) => f.phone === phone);
          if (existing) {
            return {
              frequent: s.frequent.map((f) =>
                f.phone === phone ? { ...f, lastUsed: Date.now(), count: f.count + 1 } : f,
              ),
            };
          }
          return {
            frequent: [{ id: genId(), phone, network, lastUsed: Date.now(), count: 1 }, ...s.frequent].slice(0, 8),
          };
        }),
      toggleSmart: () => set((s) => ({ smartMode: !s.smartMode })),
      toggleDark: () => {
        const next = !get().darkMode;
        set({ darkMode: next });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next);
        }
      },
      toggleHideBalance: () => set((s) => ({ balanceHidden: !s.balanceHidden })),
      toggleService: (key) => set((s) => ({ services: { ...s.services, [key]: !s.services[key] } })),
      setMargin: (key, value) => set((s) => ({ margins: { ...s.margins, [key]: value } })),
      markNotificationsRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      freezeCard: (id) =>
        set((s) => ({ cards: s.cards.map((c) => (c.id === id ? { ...c, frozen: !c.frozen } : c)) })),
      reset: () => set(seed),
    }),
    {
      name: "payroxa-store",
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode && typeof document !== "undefined") {
          document.documentElement.classList.add("dark");
        }
      },
    },
  ),
);
