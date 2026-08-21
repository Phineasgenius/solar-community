"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";
import { SOLAR_PLANTS, type SolarPlant } from "@/lib/mockData";
import { DISCOMS } from "@/lib/discomRates";
import { distanceKm, formatDistance, type LatLng } from "@/lib/geo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/useUserStore";
import { Zap, Users, Gauge, LocateFixed, MapPin } from "lucide-react";

function markerColor(percentLeft: number) {
  if (percentLeft <= 10) return "#EF4444";
  if (percentLeft <= 25) return "#F59E0B";
  return "#10B981";
}

/** Recenters the Leaflet map imperatively whenever `center` changes. */
function FlyToCenter({ center, zoom }: { center: LatLng | null; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo([center.lat, center.lng], zoom, { duration: 1.1 });
  }, [center, zoom, map]);
  return null;
}

export type SolarMapProps = {
  plants?: SolarPlant[];
  userPos?: LatLng | null;
  onRequestLocation?: () => void;
  locating?: boolean;
};

export default function SolarMap({
  plants = SOLAR_PLANTS,
  userPos = null,
  onRequestLocation,
  locating = false,
}: SolarMapProps) {
  const [selected, setSelected] = useState<SolarPlant | null>(null);
  const [shareKw, setShareKw] = useState(2);
  const subscriptions = useUserStore((s) => s.subscriptions);
  const subscribe = useUserStore((s) => s.subscribe);
  const waitlist = useUserStore((s) => s.waitlist);
  const joinWaitlist = useUserStore((s) => s.joinWaitlist);

  const openPlant = (plant: SolarPlant) => {
    setSelected(plant);
    setShareKw(2);
  };

  const existingShare = selected ? subscriptions.find((s) => s.plantId === selected.id) : undefined;
  const onWaitlist = selected ? waitlist.includes(selected.id) : false;
  const isNearlyFull = selected ? selected.capacityLeftPercent <= 5 : false;

  const handleSubscribe = () => {
    if (!selected) return;
    subscribe(selected.id, selected.name, shareKw);
    toast.success(`Subscribed to ${selected.name}`, {
      description: `${shareKw} kW share · ~${Math.round(shareKw * 4 * 30)} units/mo`,
    });
    setSelected(null);
  };

  const handleWaitlist = () => {
    if (!selected) return;
    joinWaitlist(selected.id);
    toast(`Added to waitlist for ${selected.name}`, {
      description: "We'll notify you the moment a share opens up.",
    });
    setSelected(null);
  };

  return (
    <>
      <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-surface-muted">
        <button
          onClick={onRequestLocation}
          disabled={locating}
          className="absolute right-3 top-3 z-[500] flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-navy shadow-lg backdrop-blur transition-colors hover:bg-white disabled:opacity-60"
        >
          <LocateFixed className={`h-3.5 w-3.5 ${locating ? "animate-spin" : ""}`} />
          {locating ? "Locating…" : userPos ? "Re-center on me" : "Use my location"}
        </button>

        <MapContainer center={[20.9, 78.5]} zoom={5} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyToCenter center={userPos} zoom={11} />

          {userPos && (
            <CircleMarker
              center={[userPos.lat, userPos.lng]}
              radius={9}
              pathOptions={{ color: "#2563EB", fillColor: "#3B82F6", fillOpacity: 0.9, weight: 3 }}
            >
              <Popup>
                <span className="text-sm font-medium">You are here</span>
              </Popup>
            </CircleMarker>
          )}

          {plants.map((plant) => (
            <CircleMarker
              key={plant.id}
              center={[plant.lat, plant.lng]}
              radius={10}
              pathOptions={{
                color: markerColor(plant.capacityLeftPercent),
                fillColor: markerColor(plant.capacityLeftPercent),
                fillOpacity: 0.7,
                weight: 2,
              }}
              eventHandlers={{ click: () => openPlant(plant) }}
            >
              <Popup>
                <div className="font-sans text-sm">
                  <p className="font-semibold">{plant.name}</p>
                  <p className="text-xs text-slate-500">
                    {plant.capacityKw} kW · {plant.capacityLeftPercent}% capacity left
                    {userPos && ` · ${formatDistance(distanceKm(userPos, plant))} away`}
                  </p>
                  <button
                    className="mt-2 rounded-md bg-amber-500 px-2 py-1 text-xs font-semibold text-slate-900"
                    onClick={() => openPlant(plant)}
                  >
                    View & Subscribe
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-1">
                  {selected.type} · {selected.city} ·{" "}
                  {DISCOMS.find((d) => d.id === selected.discomId)?.shortName}
                  {userPos && (
                    <span className="flex items-center gap-1 text-navy-light/70">
                      <MapPin className="h-3 w-3" />
                      {formatDistance(distanceKm(userPos, selected))} from you
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-3 rounded-xl bg-surface p-4">
                <div className="text-center">
                  <Gauge className="mx-auto mb-1 h-4 w-4 text-gold" />
                  <p className="font-display text-sm font-bold text-navy">
                    {selected.capacityLeftPercent}%
                  </p>
                  <p className="font-mono text-[10px] text-navy-light/50">Capacity Left</p>
                </div>
                <div className="text-center">
                  <Users className="mx-auto mb-1 h-4 w-4 text-gold" />
                  <p className="font-display text-sm font-bold text-navy">
                    {selected.subscribers}
                  </p>
                  <p className="font-mono text-[10px] text-navy-light/50">Subscribers</p>
                </div>
                <div className="text-center">
                  <Zap className="mx-auto mb-1 h-4 w-4 text-gold" />
                  <p className="font-display text-sm font-bold text-navy">
                    ₹{selected.pricePerUnit}/unit
                  </p>
                  <p className="font-mono text-[10px] text-navy-light/50">Sub. Price</p>
                </div>
              </div>

              {isNearlyFull && !existingShare ? (
                <div className="mt-4 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm text-navy">
                  <p className="font-semibold">Almost fully subscribed</p>
                  <p className="mt-1 text-xs text-navy-light/70">
                    Only {selected.capacityLeftPercent}% capacity remains. Join the waitlist and
                    we&apos;ll notify you the moment a share opens up.
                  </p>
                  <Button
                    onClick={handleWaitlist}
                    variant="secondary"
                    size="sm"
                    className="mt-3 w-full"
                    disabled={onWaitlist}
                  >
                    {onWaitlist ? "You're on the waitlist" : "Join Waitlist"}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mt-4">
                    <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-navy-light/60">
                      Share Size (kW)
                    </label>
                    <input
                      type="range"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={shareKw}
                      onChange={(e) => setShareKw(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <Badge variant="gold">{shareKw} kW</Badge>
                      <span className="font-mono text-xs text-navy-light/60">
                        ~{Math.round(shareKw * 4 * 30)} units/mo
                      </span>
                    </div>
                  </div>

                  <Button onClick={handleSubscribe} size="lg" className="mt-5 w-full">
                    {existingShare ? "Update Subscription" : "Subscribe via VNM"}
                  </Button>
                  {existingShare && (
                    <p className="mt-2 text-center text-xs text-emerald-dark">
                      You already hold a {existingShare.kw} kW share here.
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
