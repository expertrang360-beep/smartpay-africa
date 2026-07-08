import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TxnStatus = "success" | "pending" | "failed";
export type TxnKind =
  | "airtime" | "data" | "electricity" | "cable"
  | "fund" | "withdraw" | "cashback" | "referral" | "bonus";

export interface Transaction {
  id: string;
  kind: TxnKind;
  amount: number;         // negative for debits, positive for credits
  status: TxnStatus;
  createdAt: number;
  title: string;
  subtitle?: string;
  ref: string;
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

export interface UserState {
  name: string;
  email: string;
  phone: string;
  pin: string;              // demo only
  balance: number;
  cashback: number;
  referralCode: string;
  referralEarnings: number;
  transactions: Transaction[];
  frequent: FrequentContact[];
  smartMode: boolean;
  darkMode: boolean;
  isAdmin: boolean;
  // service toggles (admin)
  services: { airtime: boolean; data: boolean; electricity: boolean; cable: boolean };
  // per-service profit margin %
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
  toggleService: (key: keyof UserState["services"]) => void;
  setMargin: (key: keyof UserState["margins"], value: number) => void;
  reset: () => void;
}

const genRef = () => "SP" + Math.random().toString(36).slice(2, 10).toUpperCase();
const genId = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);

const seed: UserState = {
  name: "Chidi Obi",
  email: "chidi@smartpay.ng",
  phone: "08031234567",
  pin: "1234",
  balance: 142500,
  cashback: 1850,
  referralCode: "CHIDI25",
  referralEarnings: 4500,
  smartMode: true,
  darkMode: false,
  isAdmin: true,
  services: { airtime: true, data: true, electricity: true, cable: true },
  margins: { airtime: 2, data: 3, electricity: 1.5, cable: 2.5 },
  frequent: [
    { id: "1", phone: "08031234567", network: "MTN", lastUsed: Date.now() - 3600e3, count: 8 },
    { id: "2", phone: "08021234567", network: "Airtel", lastUsed: Date.now() - 86400e3, count: 3 },
    { id: "3", phone: "08051234567", network: "Glo", lastUsed: Date.now() - 172800e3, count: 2 },
  ],
  transactions: [
    { id: "t1", kind: "airtime", amount: -2000, status: "success", createdAt: Date.now() - 3600e3,
      title: "MTN Airtime", subtitle: "0803 123 ****", ref: genRef(), cashback: 20 },
    { id: "t2", kind: "electricity", amount: -15000, status: "success", createdAt: Date.now() - 86400e3,
      title: "EKEDC Token", subtitle: "Meter 452103998", ref: genRef(), token: "1234-5678-9012-3456-7890" },
    { id: "t3", kind: "data", amount: -2450, status: "pending", createdAt: Date.now() - 43200e3,
      title: "MTN 5GB", subtitle: "0803 123 ****", ref: genRef() },
    { id: "t4", kind: "fund", amount: 50000, status: "success", createdAt: Date.now() - 172800e3,
      title: "Wallet Funding", subtitle: "Paystack", ref: genRef() },
    { id: "t5", kind: "cable", amount: -9300, status: "success", createdAt: Date.now() - 259200e3,
      title: "DSTV Confam", subtitle: "IUC 1022394882", ref: genRef() },
    { id: "t6", kind: "referral", amount: 500, status: "success", createdAt: Date.now() - 345600e3,
      title: "Referral Bonus", subtitle: "@ada_okoro joined", ref: genRef() },
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
          transactions: [
            { ...base, amount, id: genId(), createdAt: Date.now() },
            ...s.transactions,
          ],
        })),
      debit: (amount, base) => {
        const s = get();
        if (s.balance < amount) return null;
        const txn: Transaction = { ...base, amount: -amount, id: genId(), createdAt: Date.now() };
        set({
          balance: s.balance - amount,
          transactions: [txn, ...s.transactions],
        });
        return txn;
      },
      addTxn: (base) => {
        const txn: Transaction = { ...base, id: genId(), createdAt: Date.now() };
        set((s) => ({ transactions: [txn, ...s.transactions] }));
        return txn;
      },
      updateTxn: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
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
            frequent: [
              { id: genId(), phone, network, lastUsed: Date.now(), count: 1 },
              ...s.frequent,
            ].slice(0, 8),
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
      toggleService: (key) =>
        set((s) => ({ services: { ...s.services, [key]: !s.services[key] } })),
      setMargin: (key, value) =>
        set((s) => ({ margins: { ...s.margins, [key]: value } })),
      reset: () => set(seed),
    }),
    {
      name: "smartpay-store",
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode && typeof document !== "undefined") {
          document.documentElement.classList.add("dark");
        }
      },
    },
  ),
);
