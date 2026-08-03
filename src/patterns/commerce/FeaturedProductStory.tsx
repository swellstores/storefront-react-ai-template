import { Link } from "react-router-dom";
import type { Product } from "swell-js";
import { getProductImage, getProductPrice } from "@/commerce";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FeaturedProductStoryProps {
  product: Product | null | undefined;
  eyebrow?: string;
  title: string;
  body: string;
  ctaLabel?: string;
  className?: string;
}

export function FeaturedProductStory({
  product,
  eyebrow,
  title,
  body,
  ctaLabel = "View product",
  className,
}: FeaturedProductStoryProps) {
  const image = getProductImage(product);
  const price = getProductPrice(product);

  return (
    <section className={cn("px-5 py-16 sm:px-8 lg:px-12", className)}>
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.5rem] border bg-card shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[28rem] bg-muted">
          {image ? (
            <img
              src={image.url}
              alt={image.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,hsl(var(--primary)/0.22),transparent_30%),hsl(var(--muted))]" />
          )}
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          {eyebrow ? (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-pretty text-lg leading-8 text-muted-foreground">{body}</p>
          {product ? (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to={`/products/${product.slug}`}>{ctaLabel}</Link>
              </Button>
              <span className="text-sm text-muted-foreground">
                {price.price !== null
                  ? `${price.currency ? `${price.currency} ` : ""}${price.salePrice ?? price.price}`
                  : product.name}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
