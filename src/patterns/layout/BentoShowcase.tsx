import { cn } from "@/lib/utils";

export interface BentoItem {
  title: string;
  body?: string;
  eyebrow?: string;
}

export interface BentoShowcaseProps {
  title?: string;
  items: BentoItem[];
  className?: string;
}

export function BentoShowcase({ title, items, className }: BentoShowcaseProps) {
  return (
    <section className={cn("px-5 py-16 sm:px-8 lg:px-12", className)}>
      <div className="mx-auto max-w-7xl">
        {title ? (
          <h2 className="mb-8 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            {title}
          </h2>
        ) : null}
        <div className="grid gap-4 md:grid-cols-3">
          {items.slice(0, 6).map((item, index) => (
            <article
              className={cn(
                "rounded-[2rem] border bg-card p-7 shadow-sm",
                index === 0 && "md:col-span-2 md:row-span-2 md:p-9",
                index === 3 && "md:col-span-2",
              )}
              key={`${item.title}-${index}`}
            >
              {item.eyebrow ? (
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                  {item.eyebrow}
                </p>
              ) : null}
              <h3 className="text-2xl font-semibold tracking-[-0.03em]">{item.title}</h3>
              {item.body ? (
                <p className="mt-3 leading-7 text-muted-foreground">{item.body}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
