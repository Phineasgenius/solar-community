import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "gold" | "emerald" | "navy" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  gold: "bg-gold/15 text-gold-dark border border-gold/30",
  emerald: "bg-emerald/15 text-emerald-light border border-emerald/30",
  navy: "bg-navy text-ink border border-navy",
  outline: "bg-transparent text-ink border border-surface-muted",
};

export function Badge({
  className,
  variant = "gold",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium font-mono tracking-tight",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
