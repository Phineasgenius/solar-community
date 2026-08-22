import Image from "next/image";
import { Sun, ShieldCheck, Users, TrendingDown, MapPin, FileCheck2, Gauge } from "lucide-react";
import VnmCalculator from "@/components/VnmCalculator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const STEPS = [
  {
    icon: MapPin,
    title: "Find a nearby plant",
    detail:
      "Use your location on the Marketplace map to see which community solar plants have open capacity closest to you.",
  },
  {
    icon: FileCheck2,
    title: "Subscribe with your CA number",
    detail:
      "Pick a share size in kW, link your DISCOM consumer account, and confirm — no rooftop installation needed.",
  },
  {
    icon: Sun,
    title: "The plant generates, you get credited",
    detail:
      "Your share of the plant's output is converted into Virtual Net Metering credits every billing cycle.",
  },
  {
    icon: Gauge,
    title: "Credits land on your DISCOM bill",
    detail:
      "Credits are applied automatically against your existing electricity bill — track every cycle from your dashboard.",
  },
];

const STATS = [
  { icon: Users, label: "Subscribed Households", value: "1,240+" },
  { icon: TrendingDown, label: "Avg. Bill Reduction", value: "35%" },
  { icon: Sun, label: "Community Plants Live", value: "6" },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy">
        {/* Background image — drop your file at /public/assets/hero-bg.jpg and it renders here */}
        <div className="absolute inset-0">
          <Image
            src="/assets/hero-bg.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-cell-panels opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/60 to-navy" />
        <div className="absolute inset-0 bg-navy/10" />
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl animate-pulse-glow" />

        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8">
          <Badge variant="gold" className="mx-auto mb-6 w-fit">
            <Sun className="h-3 w-3" /> Virtual Net Metering, Live in 6 Cities
          </Badge>
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink drop-shadow-[0_2px_18px_rgba(0,0,0,0.65)] sm:text-6xl">
            No Roof? No Problem.
            <br />
            <span className="text-gold">Subscribe to Local Solar</span>
            <br />
            & Cut DISCOM Bills by 35%.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-sm text-ink/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] sm:text-base">
            Join a nearby community solar plant, earn virtual net-metering credits on your
            existing electricity bill, and track every unit generated in real time — no
            installation on your own roof required.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <a href="#calculator">
                <Sun className="h-4 w-4" />
                Calculate My Savings
              </a>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/marketplace">Browse Solar Plants</Link>
            </Button>
          </div>

          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <Icon className="mx-auto mb-2 h-5 w-5 text-gold" />
                <p className="font-display text-xl font-bold text-ink">{value}</p>
                <p className="mt-0.5 font-mono text-[11px] text-ink/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-surface-muted bg-surface-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
              How Virtual Net Metering Works
            </h2>
            <p className="mt-2 text-sm text-ink-muted/60">
              Four steps from "no roof" to a lower DISCOM bill.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, detail }, i) => (
              <div key={title} className="relative rounded-2xl border border-surface-muted p-5">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="absolute right-5 top-5 font-mono text-xs text-ink-muted/30">
                  0{i + 1}
                </span>
                <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-muted/60">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
            Your VNM Savings Engine
          </h2>
          <p className="mt-2 text-sm text-ink-muted/60">
            Enter your bill and DISCOM to see exactly how much a shared solar subscription would
            save you every month.
          </p>
        </div>
        <VnmCalculator />
      </section>

      {/* TRUST STRIP */}
      <section className="border-t border-surface-muted bg-surface-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald" />
            <p className="text-sm text-ink-muted/70">
              Every subscription is metered against real DISCOM slab tariffs and settled through
              your existing bill — no separate wallet, no new hardware.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">View Sample Dashboard</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
