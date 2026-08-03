import { Link } from "react-router-dom";
import type { Category } from "swell-js";
import { getCategoryImage } from "@/commerce";
import { cn } from "@/lib/utils";

export interface CategoryMosaicProps {
  categories: Category[];
  title: string;
  eyebrow?: string;
  className?: string;
}

export function CategoryMosaic({ categories, title, eyebrow, className }: CategoryMosaicProps) {
  return (
    <section className={cn("px-5 py-16 sm:px-8 lg:px-12", className)}>
      <div className="mx-auto max-w-7xl">
        {eyebrow ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mb-8 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          {title}
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          {categories.slice(0, 5).map((category, index) => (
            <CategoryTile
              category={category}
              featured={index === 0}
              key={category.id ?? category.slug ?? index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTile({ category, featured }: { category: Category; featured?: boolean }) {
  const image = getCategoryImage(category);

  return (
    <Link
      to={`/categories/${category.slug}`}
      className={cn(
        "group relative min-h-64 overflow-hidden rounded-[2rem] border bg-muted p-6 shadow-sm",
        featured && "md:col-span-2 md:row-span-2 md:min-h-[32rem]",
      )}
    >
      {image ? (
        <img
          src={image.url}
          alt={image.alt}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,hsl(var(--primary)/0.24),transparent_28%),hsl(var(--muted))]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent" />
      <div className="relative mt-auto flex h-full flex-col justify-end">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-background/70">
          Collection
        </p>
        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-background">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
