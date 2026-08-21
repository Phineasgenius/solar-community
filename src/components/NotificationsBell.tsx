"use client";

import { useState } from "react";
import { Bell, Zap, Gauge, Receipt, Sparkles } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { NOTIFICATIONS, type NotificationItem } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const iconFor: Record<NotificationItem["type"], typeof Zap> = {
  credit: Zap,
  capacity: Gauge,
  billing: Receipt,
  system: Sparkles,
};

const colorFor: Record<NotificationItem["type"], string> = {
  credit: "text-emerald bg-emerald/10",
  capacity: "text-gold bg-gold/10",
  billing: "text-navy bg-navy/10",
  system: "text-sky-600 bg-sky-100",
};

export default function NotificationsBell() {
  const [seen, setSeen] = useState(false);
  const unreadCount = seen ? 0 : NOTIFICATIONS.length;

  return (
    <DropdownMenu onOpenChange={(open) => open && setSeen(true)}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-surface/70 transition-colors hover:bg-white/10 hover:text-surface"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-gold ring-2 ring-navy" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-between border-b border-surface-muted px-4 py-3">
          <p className="font-display text-sm font-semibold text-navy">Notifications</p>
          <span className="font-mono text-[11px] text-navy-light/50">{NOTIFICATIONS.length} recent</span>
        </div>
        <div className="max-h-80 divide-y divide-surface-muted overflow-y-auto">
          {NOTIFICATIONS.map((n) => {
            const Icon = iconFor[n.type];
            return (
              <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-surface-muted/40">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    colorFor[n.type]
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug text-navy">{n.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-navy-light/60">{n.detail}</p>
                  <p className="mt-1 font-mono text-[10px] text-navy-light/40">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
