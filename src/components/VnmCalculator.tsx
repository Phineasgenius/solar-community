"use client";

import { useEffect, useMemo, useState } from "react";
import { Sun, Leaf, Zap, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DISCOMS, calculateVnm } from "@/lib/discomRates";
import { formatINR, formatNumber } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";

const TIERS = [
  { id: "1bhk", label: "1BHK", multiplier: 0.6 },
  { id: "2bhk", label: "2BHK", multiplier: 0.85 },
  { id: "3bhk", label: "3BHK (Standard)", multiplier: 1 },
  { id: "villa", label: "Villa / Independent House", multiplier: 1.6 },
];

export default function VnmCalculator() {
  const [mounted, setMounted] = useState(false);
  const consumerId = useUserStore((s) => s.consumerId);
  const setConsumerId = useUserStore((s) => s.setConsumerId);
  const discomId = useUserStore((s) => s.discomId);
  const setDiscomId = useUserStore((s) => s.setDiscomId);
  const monthlyBill = useUserStore((s) => s.monthlyBill);
  const setMonthlyBill = useUserStore((s) => s.setMonthlyBill);

  const [tierId, setTierId] = useState("3bhk");

  useEffect(() => setMounted(true), []);

  const discom = DISCOMS.find((d) => d.id === discomId) ?? DISCOMS[0];
  const tier = TIERS.find((t) => t.id === tierId) ?? TIERS[2];

  const result = useMemo(() => {
    const subscribedKw = (monthlyBill / 3000) * 3.5 * tier.multiplier;
    return calculateVnm(monthlyBill, discom, subscribedKw);
  }, [monthlyBill, discom, tier]);

  if (!mounted) {
    return <div className="h-[520px] w-full animate-pulse rounded-2xl bg-navy-light/10" />;
  }

  return (
    <div id="calculator" className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardContent className="flex flex-col gap-6 p-6">
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-muted/60">
              Consumer Account (CA) Number
            </label>
            <input
              value={consumerId}
              onChange={(e) => setConsumerId(e.target.value)}
              placeholder="e.g. CA-104209"
              className="w-full rounded-xl border border-surface-muted bg-surface px-4 py-2.5 font-mono text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-muted/60">
                DISCOM
              </label>
              <select
                value={discomId}
                onChange={(e) => setDiscomId(e.target.value)}
                className="w-full rounded-xl border border-surface-muted bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              >
                {DISCOMS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.shortName} ({d.state})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-muted/60">
                Household Tier
              </label>
              <select
                value={tierId}
                onChange={(e) => setTierId(e.target.value)}
                className="w-full rounded-xl border border-surface-muted bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              >
                {TIERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wide text-ink-muted/60">
                Average Monthly Bill
              </label>
              <span className="font-display text-lg font-bold text-ink">
                {formatINR(monthlyBill)}
                <span className="ml-1 text-xs font-normal text-ink-muted/50">/mo</span>
              </span>
            </div>
            <Slider
              value={[monthlyBill]}
              onValueChange={([v]) => setMonthlyBill(v)}
              min={500}
              max={15000}
              step={100}
            />
            <div className="mt-1.5 flex justify-between font-mono text-[11px] text-ink-muted/40">
              <span>₹500</span>
              <span>₹15,000</span>
            </div>
          </div>

          <div className="rounded-xl bg-navy p-4 font-mono text-xs text-ink/70">
            Estimated current usage: ~{formatNumber(result.consumptionUnits, 0)} units/month at{" "}
            {discom.shortName} slab rates.
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 lg:col-span-2">
        <Card className="border-gold/30 bg-gradient-to-br from-navy to-navy-light text-ink">
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-gold" />
              <span className="font-mono text-xs uppercase tracking-wide text-ink/60">
                Virtual Credit Offset
              </span>
            </div>
            <div className="font-display text-4xl font-extrabold text-gold">
              {formatINR(result.monthlySavings)}
              <span className="ml-1 text-base font-medium text-ink/60">/mo</span>
            </div>
            <Badge variant="gold" className="w-fit">
              {result.savingsPercent}% bill reduction
            </Badge>
            <div className="h-px bg-white/10" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wide text-ink/50">
                  Recommended Share
                </p>
                <p className="font-display font-semibold">{result.recommendedKw} kW Plant</p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wide text-ink/50">
                  Post-VNM Bill
                </p>
                <p className="font-display font-semibold">{formatINR(result.postVnmBill)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald/20">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
              <Leaf className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl font-bold text-ink">
                {result.carbonSavedTonsPerYear} Tons CO2/year
              </p>
              <p className="text-xs text-ink-muted/60">Carbon offset from your solar share</p>
            </div>
          </CardContent>
        </Card>

        <Button asChild size="lg" className="w-full">
          <Link href="/marketplace">
            <Zap className="h-4 w-4" />
            Find a Plant Near You
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
