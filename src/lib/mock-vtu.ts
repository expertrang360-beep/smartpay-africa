// Mock VTU provider layer. Simulates multi-provider redundancy + Smart Mode
// (pick cheapest + fastest). Swap for real APIs later without touching UI.

export type Network = "MTN" | "Airtel" | "Glo" | "9mobile";
export type Disco =
  | "EKEDC" | "IKEDC" | "AEDC" | "PHED" | "IBEDC" | "KEDCO";
export type CableProvider = "DSTV" | "GOTV" | "Startimes";

export interface ProviderQuote {
  providerId: string;
  providerName: string;
  cost: number;      // what we pay upstream (kobo not used; naira)
  latencyMs: number; // simulated
  uptime: number;    // 0..1
}

const AIRTIME_PROVIDERS = [
  { id: "smartbilling", name: "SmartBilling", markup: 0.98, latency: 900, uptime: 0.98 },
  { id: "quickvtu", name: "QuickVTU", markup: 0.985, latency: 1600, uptime: 0.94 },
  { id: "afripay", name: "AfriPay", markup: 0.975, latency: 2200, uptime: 0.99 },
];

export function quoteAirtime(amount: number): ProviderQuote[] {
  return AIRTIME_PROVIDERS.map((p) => ({
    providerId: p.id,
    providerName: p.name,
    cost: Math.round(amount * p.markup * 100) / 100,
    latencyMs: p.latency,
    uptime: p.uptime,
  }));
}

// Smart Mode: cheapest+fastest weighted score (lower is better)
export function smartPick(quotes: ProviderQuote[]): ProviderQuote {
  return [...quotes].sort((a, b) => {
    const sa = a.cost * 1000 + a.latencyMs - a.uptime * 500;
    const sb = b.cost * 1000 + b.latencyMs - b.uptime * 500;
    return sa - sb;
  })[0];
}

export interface DataPlan {
  id: string;
  network: Network;
  label: string;
  size: string;
  validity: string;
  price: number;
  category: "SME" | "Corporate" | "Direct";
}

export const DATA_PLANS: DataPlan[] = [
  { id: "mtn-500mb", network: "MTN", label: "500MB — 30 days", size: "500MB", validity: "30 days", price: 300, category: "SME" },
  { id: "mtn-1gb", network: "MTN", label: "1GB — 30 days", size: "1GB", validity: "30 days", price: 490, category: "SME" },
  { id: "mtn-2gb", network: "MTN", label: "2GB — 30 days", size: "2GB", validity: "30 days", price: 980, category: "SME" },
  { id: "mtn-5gb", network: "MTN", label: "5GB — 30 days", size: "5GB", validity: "30 days", price: 2450, category: "SME" },
  { id: "airtel-1gb", network: "Airtel", label: "1GB — 30 days", size: "1GB", validity: "30 days", price: 475, category: "SME" },
  { id: "airtel-2gb", network: "Airtel", label: "2GB — 30 days", size: "2GB", validity: "30 days", price: 950, category: "SME" },
  { id: "airtel-5gb", network: "Airtel", label: "5GB — 30 days", size: "5GB", validity: "30 days", price: 2350, category: "SME" },
  { id: "glo-1gb", network: "Glo", label: "1GB — 30 days", size: "1GB", validity: "30 days", price: 460, category: "SME" },
  { id: "glo-3gb", network: "Glo", label: "3GB — 30 days", size: "3GB", validity: "30 days", price: 1350, category: "SME" },
  { id: "9mobile-1gb", network: "9mobile", label: "1GB — 30 days", size: "1GB", validity: "30 days", price: 470, category: "SME" },
  { id: "9mobile-2gb", network: "9mobile", label: "2GB — 30 days", size: "2GB", validity: "30 days", price: 940, category: "SME" },
];

export const CABLE_PACKAGES: {
  id: string; provider: CableProvider; name: string; price: number; duration: string;
}[] = [
  { id: "dstv-padi", provider: "DSTV", name: "Padi", price: 3600, duration: "1 month" },
  { id: "dstv-yanga", provider: "DSTV", name: "Yanga", price: 5100, duration: "1 month" },
  { id: "dstv-confam", provider: "DSTV", name: "Confam", price: 9300, duration: "1 month" },
  { id: "dstv-compact", provider: "DSTV", name: "Compact", price: 15700, duration: "1 month" },
  { id: "dstv-compactplus", provider: "DSTV", name: "Compact Plus", price: 25000, duration: "1 month" },
  { id: "gotv-smallie", provider: "GOTV", name: "Smallie", price: 1575, duration: "1 month" },
  { id: "gotv-jinja", provider: "GOTV", name: "Jinja", price: 3300, duration: "1 month" },
  { id: "gotv-jolli", provider: "GOTV", name: "Jolli", price: 4850, duration: "1 month" },
  { id: "gotv-max", provider: "GOTV", name: "Max", price: 7200, duration: "1 month" },
  { id: "startimes-nova", provider: "Startimes", name: "Nova", price: 1900, duration: "1 month" },
  { id: "startimes-basic", provider: "Startimes", name: "Basic", price: 3500, duration: "1 month" },
  { id: "startimes-classic", provider: "Startimes", name: "Classic", price: 5500, duration: "1 month" },
];

export const DISCOS: { id: Disco; name: string }[] = [
  { id: "EKEDC", name: "Eko Electric (EKEDC)" },
  { id: "IKEDC", name: "Ikeja Electric (IKEDC)" },
  { id: "AEDC", name: "Abuja Electric (AEDC)" },
  { id: "PHED", name: "Port Harcourt Electric (PHED)" },
  { id: "IBEDC", name: "Ibadan Electric (IBEDC)" },
  { id: "KEDCO", name: "Kano Electric (KEDCO)" },
];

export function detectNetwork(phone: string): Network | null {
  const digits = phone.replace(/\D/g, "").replace(/^234/, "0");
  if (!/^0\d{10}$/.test(digits)) return null;
  const prefix = digits.slice(0, 4);
  const MTN = ["0803","0806","0810","0813","0814","0816","0703","0706","0903","0906","0913","0916","0704"];
  const AIRTEL = ["0802","0808","0812","0701","0708","0902","0901","0904","0907","0912"];
  const GLO = ["0805","0807","0811","0705","0815","0905","0915"];
  const NINE = ["0809","0817","0818","0908","0909"];
  if (MTN.includes(prefix)) return "MTN";
  if (AIRTEL.includes(prefix)) return "Airtel";
  if (GLO.includes(prefix)) return "Glo";
  if (NINE.includes(prefix)) return "9mobile";
  return null;
}

// Simulate an upstream call — tiny random fail chance to demo retry/failover.
export async function callProvider(
  providerId: string,
  _payload: Record<string, unknown>,
): Promise<{ success: boolean; ref: string; message: string; token?: string }> {
  const p = AIRTIME_PROVIDERS.find((x) => x.id === providerId);
  const latency = p?.latency ?? 1200;
  await new Promise((r) => setTimeout(r, Math.min(latency, 1400)));
  const success = Math.random() < (p?.uptime ?? 0.97);
  const ref = "SP" + Math.random().toString(36).slice(2, 10).toUpperCase();
  if (!success) return { success: false, ref, message: "Upstream timeout" };
  // Electricity token
  const token = Array.from({ length: 5 }, () =>
    Math.floor(1000 + Math.random() * 9000).toString(),
  ).join("-");
  return { success: true, ref, message: "Delivered", token };
}
