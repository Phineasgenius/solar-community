"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Zap, Sun, RefreshCw, ArrowRight, Building2, Download, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GenerationVsDrawChart, CreditsEarnedChart } from "@/components/AnalyticsChart";
import { useUserStore } from "@/store/useUserStore";
import { DISCOMS, calculateVnm } from "@/lib/discomRates";
import { formatINR } from "@/lib/utils";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [cycleSimulated, setCycleSimulated] = useState(false);
  const role = useUserStore((s) => s.role);
  const discomId = useUserStore((s) => s.discomId);
  const monthlyBill = useUserStore((s) => s.monthlyBill);
  const subscriptions = useUserStore((s) => s.subscriptions);
  const unsubscribe = useUserStore((s) => s.unsubscribe);
  const consumerId = useUserStore((s) => s.consumerId);

  useEffect(() => setMounted(true), []);

  const discom = DISCOMS.find((d) => d.id === discomId) ?? DISCOMS[0];
  // Aggregate solar share across every plant the resident is subscribed to.
  const totalKw = subscriptions.reduce((sum, s) => sum + s.kw, 0) || 2;
  const result = useMemo(() => calculateVnm(monthlyBill, discom, totalKw), [monthlyBill, discom, totalKw]);

  const handleDownloadStatement = () => {
    const lines = [
      `SunShare — DISCOM Settlement Statement (Mock)`,
      `Consumer: ${consumerId || "Not linked"}`,
      `DISCOM: ${discom.name}`,
      `Billing cycle: ${new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`,
      ``,
      `Base consumption: ${result.consumptionUnits} units`,
      `Base bill: ${formatINR(result.baseBill)}`,
      `Solar VNM credit: ${result.creditedUnits} units (${formatINR(result.monthlySavings)})`,
      `Net payable: ${formatINR(result.postVnmBill)}`,
      ``,
      `Active subscriptions:`,
      ...(subscriptions.length
        ? subscriptions.map((s) => `  - ${s.plantName}: ${s.kw} kW share`)
        : ["  - None yet"]),
      ``,
      `This is a demo statement generated from mock data, not an official DISCOM document.`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sunshare-statement-${discom.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Statement downloaded");
  };

  const handleUnsubscribe = (plantId: string, plantName: string) => {
    unsubscribe(plantId);
    toast(`Unsubscribed from ${plantName}`);
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-96 w-full animate-pulse rounded-2xl bg-navy-light/10" />
      </div>
    );
  }

  if (role === "rwa") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Building2 className="mx-auto mb-4 h-10 w-10 text-gold" />
        <h1 className="font-display text-2xl font-bold text-ink">You're in Host / RWA mode</h1>
        <p className="mt-2 text-sm text-ink-muted/60">
          Switch to the Host dashboard to manage your plant, subscribers, and settlements.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/dashboard/host">
            Go to Host Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Resident Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-muted/60">
            {consumerId ? `Consumer ${consumerId}` : "No CA number linked yet"} ·{" "}
            {discom.shortName}
          </p>
        </div>
        {subscriptions.length === 0 && (
          <Button variant="outline" asChild>
            <Link href="/marketplace">Subscribe to a plant</Link>
          </Button>
        )}
      </div>

      {subscriptions.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {subscriptions.map((s) => (
            <Badge key={s.plantId} variant="emerald" className="flex items-center gap-2 pr-1.5">
              {s.kw} kW · {s.plantName}
              <button
                onClick={() => handleUnsubscribe(s.plantId, s.plantName)}
                className="rounded-full p-0.5 hover:bg-emerald-dark/20"
                aria-label={`Unsubscribe from ${s.plantName}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Link
            href="/marketplace"
            className="rounded-full border border-dashed border-surface-muted px-3 py-1 text-xs font-medium text-ink-muted/60 hover:bg-surface-muted/50"
          >
            + Add another plant
          </Link>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
              <Sun className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl font-bold text-ink">{result.generatedUnits} kWh</p>
              <p className="text-xs text-ink-muted/60">Generated this cycle</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/15 text-emerald-light">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl font-bold text-ink">
                {formatINR(result.monthlySavings)}
              </p>
              <p className="text-xs text-ink-muted/60">Credits applied this cycle</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10 text-ink">
              <RefreshCw className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl font-bold text-ink">{result.savingsPercent}%</p>
              <p className="text-xs text-ink-muted/60">Bill offset via VNM</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generation vs. Grid Draw</CardTitle>
            <CardDescription>Monthly kWh over the last 6 billing cycles</CardDescription>
          </CardHeader>
          <CardContent>
            <GenerationVsDrawChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>VNM Credits Earned</CardTitle>
            <CardDescription>Units credited back to your DISCOM bill</CardDescription>
          </CardHeader>
          <CardContent>
            <CreditsEarnedChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automated DISCOM Settlement Simulation</CardTitle>
          <CardDescription>
            Preview how your next {discom.shortName} statement will look once solar credits are
            applied.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button onClick={() => setCycleSimulated(true)} variant="emerald">
              <RefreshCw className="h-4 w-4" />
              Simulate Next Billing Cycle
            </Button>
            <Button onClick={handleDownloadStatement} variant="outline">
              <Download className="h-4 w-4" />
              Download Statement
            </Button>
          </div>

          {cycleSimulated && (
            <div className="mt-5 animate-rise-fade overflow-hidden rounded-xl border border-surface-muted">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-surface-muted">
                  <tr>
                    <td className="p-3 text-ink-muted/70">Base bill ({result.consumptionUnits} units)</td>
                    <td className="p-3 text-right font-mono">{formatINR(result.baseBill)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-ink-muted/70">
                      Solar VNM credit ({result.creditedUnits} units)
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-light">
                      − {formatINR(result.monthlySavings)}
                    </td>
                  </tr>
                  <tr className="bg-surface">
                    <td className="p-3 font-semibold text-ink">Net payable to {discom.shortName}</td>
                    <td className="p-3 text-right font-mono font-bold text-ink">
                      {formatINR(result.postVnmBill)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
