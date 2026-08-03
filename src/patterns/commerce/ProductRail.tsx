import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Product } from "swell-js";
import { getProductImage, getProductPrice } from "@/commerce";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProductRailProps {
  products: Product[];
  title: string;
  eyebrow?: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
  className?: string;
}

export function ProductRail({
  products,
  title,
  eyebrow,
  description,
  ctaLabel = "View all",
  ctaTo = "/products",
  className,
}: ProductRailProps) {
  return (
    <section className={cn("px-5 py-16 sm:px-8 lg:px-12", className)}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-primary">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-4 text-pretty leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link to={ctaTo}>
              {ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product, index) => (
            <ProductRailCard product={product} key={product.id ?? product.slug ?? index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductRailCard({ product }: { product: Product }) {
  const image = getProductImage(product);
  const price = getProductPrice(product);

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group overflow-hidden rounded-[1.75rem] border bg-card p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="overflow-hidden rounded-[1.25rem] bg-muted">
        {image ? (
          <img
            src={image.url}
            alt={image.alt}
            className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-[4/5] bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.18),transparent_28%),hsl(var(--muted))]" />
        )}
      </div>
      <div className="px-2 pb-2 pt-4">
        <h3 className="line-clamp-2 font-semibold">{product.name}</h3>
        {price.price !== null ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {price.currency ? `${price.currency} ` : ""}
            {price.salePrice ?? price.price}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
