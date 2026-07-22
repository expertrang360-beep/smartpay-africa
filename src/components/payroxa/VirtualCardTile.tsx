import type { VirtualCard as CardType } from "@/lib/store";
import { formatNaira } from "@/lib/format";
import { Snowflake, Settings2, Wifi } from "lucide-react";
import { useStore } from "@/lib/store";

const gradients: Record<CardType["color"], string> = {
  midnight: "from-[oklch(0.22_0.05_265)] via-[oklch(0.18_0.04_268)] to-[oklch(0.14_0.03_270)]",
  emerald: "from-[oklch(0.42_0.15_162)] via-[oklch(0.32_0.14_165)] to-[oklch(0.22_0.1_168)]",
  amber: "from-[oklch(0.55_0.18_72)] via-[oklch(0.42_0.15_60)] to-[oklch(0.28_0.1_50)]",
  royal: "from-[oklch(0.48_0.24_264)] via-[oklch(0.38_0.22_268)] to-[oklch(0.24_0.14_270)]",
};

export function VirtualCardTile({ card, compact = false }: { card: CardType; compact?: boolean }) {
  const { freezeCard } = useStore();
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradients[card.color]} p-5 text-white shadow-brand ${compact ? "" : "aspect-[1.586/1]"}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest opacity-70">Payroxa · {card.label}</div>
            <div className="mt-1 text-lg font-bold tabular-nums">
              {card.currency === "USD" ? `$${card.balance.toLocaleString()}` : formatNaira(card.balance)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {card.frozen && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                <Snowflake className="size-3" /> Frozen
              </span>
            )}
            <Wifi className="size-5 -rotate-90 opacity-70" />
          </div>
        </div>
        <div>
          <div className="font-mono text-lg tracking-[0.3em]">•••• •••• •••• {card.last4}</div>
          <div className="mt-3 flex items-end justify-between text-[11px]">
            <div>
              <div className="opacity-60">Expiry</div>
              <div className="font-semibold">{card.expiry}</div>
            </div>
            <div className="text-right">
              <div className="opacity-60">Network</div>
              <div className="font-semibold">{card.network}</div>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => freezeCard(card.id)}
                className="grid size-8 place-items-center rounded-lg bg-white/15 backdrop-blur ring-1 ring-white/20 hover:bg-white/25"
                aria-label={card.frozen ? "Unfreeze card" : "Freeze card"}
              >
                <Snowflake className="size-3.5" />
              </button>
              <button className="grid size-8 place-items-center rounded-lg bg-white/15 backdrop-blur ring-1 ring-white/20 hover:bg-white/25" aria-label="Card settings">
                <Settings2 className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
