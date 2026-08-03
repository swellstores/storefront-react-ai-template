import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BrandBackdropProps {
  className?: string;
  variant?: "aurora" | "confetti" | "editorial" | "minimal";
  children?: ReactNode;
}

export function BrandBackdrop({ className, variant = "aurora", children }: BrandBackdropProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", variantClassName[variant], className)}>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-10%] top-1/4 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute bottom-[-18%] left-1/3 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>
      {children}
    </div>
  );
}

const variantClassName = {
  aurora:
    "bg-[radial-gradient(circle_at_15%_20%,hsl(var(--primary)/0.16),transparent_28%),radial-gradient(circle_at_85%_10%,hsl(var(--accent)/0.18),transparent_30%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)))]",
  confetti:
    "bg-[radial-gradient(circle_at_10%_10%,hsl(var(--primary)/0.18)_0_10%,transparent_11%),radial-gradient(circle_at_90%_20%,hsl(var(--accent)/0.18)_0_8%,transparent_9%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--secondary)/0.24))]",
  editorial: "bg-[linear-gradient(120deg,hsl(var(--background))_0_55%,hsl(var(--muted))_55%_100%)]",
  minimal: "bg-background",
} satisfies Record<NonNullable<BrandBackdropProps["variant"]>, string>;
