"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Gauge, Users, Zap, ArrowLeft, Search, Sun, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { SOLAR_PLANTS, generateSubscribers } from "@/lib/mockData";
import { formatINR } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";

const statusVariant = {
  Active: "emerald",
  "Pending KYC": "gold",
  Paused: "outline",
} as const;

export default function HostDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const role = useUserStore((s) => s.role);
  const [plantId, setPlantId] = useState(SOLAR_PLANTS[0].id);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Pending KYC" | "Paused">(
    "All"
  );
  const plant = SOLAR_PLANTS.find((p) => p.id === plantId) ?? SOLAR_PLANTS[0];
  const subscribers = useMemo(
    () => generateSubscribers(plant.subscribers, plant.capacityKw),
    [plant]
  );

  useEffect(() => setMounted(true), []);

  const visibleSubscribers = useMemo(() => {
    let list = subscribers;
    if (statusFilter !== "All") list = list.filter((s) => s.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) => s.caNumber.toLowerCase().includes(q) || s.flatNo.toLowerCase().includes(q)
      );
    }
    return list;
  }, [subscribers, search, statusFilter]);

  const totalCredits = subscribers.reduce((sum, s) => sum + s.monthlyVnmCredit, 0);
  const activeCount = subscribers.filter((s) => s.status === "Active").length;
  const monthlyOutputKwh = Math.round(plant.capacityKw * 4 * 30 * 0.92);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-96 w-full animate-pulse rounded-2xl bg-navy-light/10" />
      </div>
    );
  }

  if (role !== "rwa") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Sun className="mx-auto mb-4 h-10 w-10 text-gold" />
        <h1 className="font-display text-2xl font-bold text-ink">You're in Resident mode</h1>
        <p className="mt-2 text-sm text-ink-muted/60">
          Switch to Resident from the navbar toggle, or head back to your resident dashboard.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/dashboard">
            Go to Resident Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-ink-muted/60 hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to resident view
      </Link>

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Host / RWA Management
          </h1>
          <p className="mt-1 text-sm text-ink-muted/60">
            Manage plant capacity, subscriber allocations, and monthly VNM settlements.
          </p>
        </div>
        <select
          value={plantId}
          onChange={(e) => setPlantId(e.target.value)}
          className="rounded-xl border border-surface-muted bg-surface-card px-4 py-2.5 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
        >
          {SOLAR_PLANTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <Gauge className="mb-2 h-5 w-5 text-gold" />
            <p className="font-display text-xl font-bold text-ink">{plant.capacityKw} kW</p>
            <p className="text-xs text-ink-muted/60">Plant Capacity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Users className="mb-2 h-5 w-5 text-gold" />
            <p className="font-display text-xl font-bold text-ink">
              {activeCount} / {subscribers.length}
            </p>
            <p className="text-xs text-ink-muted/60">Active Subscribers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Zap className="mb-2 h-5 w-5 text-gold" />
            <p className="font-display text-xl font-bold text-ink">
              {monthlyOutputKwh.toLocaleString("en-IN")} kWh
            </p>
            <p className="text-xs text-ink-muted/60">Grid Output / Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Badge variant="gold" className="mb-2">
              Total Credits
            </Badge>
            <p className="font-display text-xl font-bold text-ink">{formatINR(totalCredits)}</p>
            <p className="text-xs text-ink-muted/60">Disbursed to residents / month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscriber Ledger</CardTitle>
          <CardDescription>
            Allocated share and monthly VNM credit per household on {plant.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search CA number or flat no…"
                className="w-full rounded-xl border border-surface-muted bg-surface py-2 pl-9 pr-4 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="rounded-xl border border-surface-muted bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Pending KYC">Pending KYC</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CA Number</TableHead>
                <TableHead>Flat No.</TableHead>
                <TableHead>Allocated Share</TableHead>
                <TableHead>Monthly VNM Credit</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleSubscribers.slice(0, 25).map((s) => (
                <TableRow key={s.caNumber}>
                  <TableCell className="font-mono text-xs">{s.caNumber}</TableCell>
                  <TableCell>{s.flatNo}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {s.allocatedSharePercent}% ({s.allocatedKw} kW)
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {formatINR(s.monthlyVnmCredit)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {visibleSubscribers.length === 0 && (
            <p className="py-6 text-center text-sm text-ink-muted/50">
              No subscribers match this search/filter.
            </p>
          )}
          {visibleSubscribers.length > 25 && (
            <p className="mt-3 text-center font-mono text-xs text-ink-muted/50">
              Showing 25 of {visibleSubscribers.length} matching subscribers
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
