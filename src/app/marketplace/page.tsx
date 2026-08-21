"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { SOLAR_PLANTS, type SolarPlant } from "@/lib/mockData";
import { DISCOMS } from "@/lib/discomRates";
import { getCurrentPosition, distanceKm, formatDistance, type LatLng } from "@/lib/geo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Gauge, Search, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

const SolarMap = dynamic(() => import("@/components/SolarMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[520px] w-full items-center justify-center rounded-2xl border border-surface-muted bg-surface-card font-mono text-sm text-navy-light/50">
      Loading map…
    </div>
  ),
});

const CITIES = ["All Cities", ...Array.from(new Set(SOLAR_PLANTS.map((p) => p.city)))];
const TYPES = ["All Types", ...Array.from(new Set(SOLAR_PLANTS.map((p) => p.type)))];
type SortKey = "distance" | "price" | "capacity";

export default function MarketplacePage() {
  const [city, setCity] = useState("All Cities");
  const [type, setType] = useState("All Types");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("capacity");
  const [radiusKm, setRadiusKm] = useState(500);

  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);

  const handleRequestLocation = async () => {
    setLocating(true);
    const pos = await getCurrentPosition();
    setLocating(false);
    if (!pos) {
      toast.error("Couldn't get your location", {
        description: "Check your browser's location permission and try again.",
      });
      return;
    }
    setUserPos(pos);
    setSortKey("distance");
    toast.success("Location found — showing nearby plants first");
  };

  const withDistance = useMemo(
    () =>
      SOLAR_PLANTS.map((p) => ({
        plant: p,
        distance: userPos ? distanceKm(userPos, p) : null,
      })),
    [userPos]
  );

  const filtered = useMemo(() => {
    let list = withDistance;
    if (city !== "All Cities") list = list.filter((x) => x.plant.city === city);
    if (type !== "All Types") list = list.filter((x) => x.plant.type === type);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (x) => x.plant.name.toLowerCase().includes(q) || x.plant.city.toLowerCase().includes(q)
      );
    }
    if (userPos) list = list.filter((x) => (x.distance ?? Infinity) <= radiusKm);

    const sorted = [...list].sort((a, b) => {
      if (sortKey === "distance" && userPos) return (a.distance ?? Infinity) - (b.distance ?? Infinity);
      if (sortKey === "price") return a.plant.pricePerUnit - b.plant.pricePerUnit;
      return b.plant.capacityLeftPercent - a.plant.capacityLeftPercent;
    });
    return sorted;
  }, [withDistance, city, type, query, userPos, radiusKm, sortKey]);

  const mapPlants: SolarPlant[] = filtered.map((x) => x.plant);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight text-navy">
          Local Solar Plant Discovery
        </h1>
        <p className="text-sm text-navy-light/60">
          Explore active community solar plants near you and subscribe directly through virtual
          net metering.
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-surface-muted bg-surface-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-light/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by plant name or city…"
              className="w-full rounded-xl border border-surface-muted bg-surface py-2.5 pl-9 pr-4 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl border border-surface-muted bg-surface px-3 py-2.5 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-xl border border-surface-muted bg-surface px-3 py-2.5 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          >
            <option value="capacity">Sort: Most capacity left</option>
            <option value="price">Sort: Lowest price / unit</option>
            <option value="distance" disabled={!userPos}>
              Sort: Nearest to me{!userPos ? " (share location)" : ""}
            </option>
          </select>
        </div>

        {userPos && (
          <div className="flex items-center gap-3">
            <Navigation className="h-3.5 w-3.5 shrink-0 text-gold" />
            <label className="whitespace-nowrap font-mono text-xs text-navy-light/60">
              Within {radiusKm >= 500 ? "any distance" : formatDistance(radiusKm)}
            </label>
            <input
              type="range"
              min={5}
              max={500}
              step={5}
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseInt(e.target.value))}
              className="w-full max-w-xs accent-amber-500"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium font-mono transition-colors",
                c === city
                  ? "border-gold bg-gold/15 text-gold-dark"
                  : "border-surface-muted text-navy-light/60 hover:bg-surface-muted/50"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SolarMap
            plants={mapPlants}
            userPos={userPos}
            onRequestLocation={handleRequestLocation}
            locating={locating}
          />
        </div>

        <div className="flex flex-col gap-3 lg:col-span-2">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-surface-muted p-6 text-center text-sm text-navy-light/50">
              No plants match these filters. Try widening your radius or clearing a filter.
            </div>
          )}
          {filtered.map(({ plant, distance }) => (
            <Card key={plant.id}>
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-sm font-semibold text-navy">{plant.name}</p>
                    <p className="flex flex-wrap items-center gap-1 text-xs text-navy-light/60">
                      <MapPin className="h-3 w-3" /> {plant.city} ·{" "}
                      {DISCOMS.find((d) => d.id === plant.discomId)?.shortName}
                      {distance !== null && (
                        <span className="font-mono text-gold-dark">
                          · {formatDistance(distance)} away
                        </span>
                      )}
                    </p>
                  </div>
                  <Badge
                    variant={
                      plant.capacityLeftPercent <= 10
                        ? "gold"
                        : plant.capacityLeftPercent <= 25
                        ? "outline"
                        : "emerald"
                    }
                  >
                    {plant.capacityLeftPercent}% left
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-navy-light/60">
                  <span className="flex items-center gap-1">
                    <Gauge className="h-3.5 w-3.5" /> {plant.capacityKw} kW
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {plant.subscribers} subs
                  </span>
                  <span>₹{plant.pricePerUnit}/unit</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
