"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, MapPin, LayoutDashboard, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import NotificationsBell from "@/components/NotificationsBell";

const links = [
  { href: "/marketplace", label: "Marketplace", icon: MapPin },
  { href: "/", label: "VNM Calculator", icon: Sun },
];

export default function Navbar() {
  const pathname = usePathname();
  const role = useUserStore((s) => s.role);
  const setRole = useUserStore((s) => s.setRole);
  const dashboardHref = role === "rwa" ? "/dashboard/host" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold text-navy-dark">
            <Sun className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            SunShare
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-gold"
                    : "text-ink/70 hover:bg-white/5 hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
          <Link
            href={dashboardHref}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/dashboard")
                ? "bg-white/10 text-gold"
                : "text-ink/70 hover:bg-white/5 hover:text-ink"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-2">
        <NotificationsBell />
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-xs font-mono">
          <button
            onClick={() => setRole("resident")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
              role === "resident" ? "bg-gold text-navy-dark font-semibold" : "text-ink/60 hover:text-ink"
            )}
          >
            <Sun className="h-3.5 w-3.5" />
            Resident
          </button>
          <button
            onClick={() => setRole("rwa")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
              role === "rwa" ? "bg-gold text-navy-dark font-semibold" : "text-ink/60 hover:text-ink"
            )}
          >
            <Building2 className="h-3.5 w-3.5" />
            RWA / Host
          </button>
        </div>
        </div>
      </nav>
    </header>
  );
}
