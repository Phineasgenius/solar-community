import { Zap } from "lucide-react";
import { LIVE_TICKER_STATS } from "@/lib/mockData";

export default function LiveTicker() {
  const items = [...LIVE_TICKER_STATS, ...LIVE_TICKER_STATS];
  return (
    <div className="overflow-hidden border-b border-white/10 bg-navy-dark py-2">
      <div className="flex w-max animate-ticker gap-10 whitespace-nowrap font-mono text-xs text-surface/60">
        {items.map((stat, i) => (
          <span key={i} className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-gold" />
            {stat}
          </span>
        ))}
      </div>
    </div>
  );
}
