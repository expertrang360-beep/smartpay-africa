import type { Network } from "@/lib/mock-vtu";

const map: Record<Network, { bg: string; text: string; label: string }> = {
  MTN: { bg: "bg-amber-400", text: "text-black", label: "MTN" },
  Airtel: { bg: "bg-red-600", text: "text-white", label: "AIR" },
  Glo: { bg: "bg-emerald-600", text: "text-white", label: "GLO" },
  "9mobile": { bg: "bg-green-800", text: "text-white", label: "9MB" },
};

export function NetworkChip({ network, size = 40 }: { network: Network; size?: number }) {
  const cfg = map[network];
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-xl font-black tracking-tight ${cfg.bg} ${cfg.text}`}
      style={{ width: size, height: size, fontSize: size * 0.28 }}
    >
      {cfg.label}
    </div>
  );
}
