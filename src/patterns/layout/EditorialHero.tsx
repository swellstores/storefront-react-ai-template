import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrandBackdrop } from "../effects";

export interface EditorialHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  className?: string;
  variant?: "editorial" | "campaign" | "split";
}

export function EditorialHero({
  eyebrow,
  title,
  description,
  ctaLabel = "Shop now",
  ctaTo = "/products",
  secondaryLabel,
  secondaryTo,
  imageUrl,
  imageAlt = "",
  className,
  variant = "editorial",
}: EditorialHeroProps) {
  return (
    <BrandBackdrop
      variant={variant === "campaign" ? "confetti" : "aurora"}
      className={cn("px-5 py-20 sm:px-8 lg:px-12 lg:py-28", className)}
    >
      <div
        className={cn(
          "mx-auto grid max-w-7xl items-center gap-10",
          variant === "split" ? "lg:grid-cols-[0.9fr_1.1fr]" : "lg:grid-cols-[1.05fr_0.95fr]",
        )}
      >
        <div className="relative z-10 max-w-4xl">
          {eyebrow ? (
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.42em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-foreground sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              {description}
            </p>
          ) : null}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link to={ctaTo}>
                {ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {secondaryLabel && secondaryTo ? (
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to={secondaryTo}>{secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="relative min-h-[360px]">
          <div className="absolute left-6 top-4 h-44 w-44 rounded-full border border-foreground/10 bg-background/60" />
          <div className="absolute bottom-0 right-0 h-72 w-56 rotate-6 rounded-[2rem] border bg-background/80 shadow-2xl" />
          <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[2rem] border bg-muted shadow-2xl">
            {imageUrl ? (
              <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,hsl(var(--muted)),hsl(var(--primary)/0.16))] text-sm uppercase tracking-[0.32em] text-muted-foreground">
                Featured
              </div>
            )}
          </div>
        </div>
      </div>
    </BrandBackdrop>
  );
}
