import { cn } from "@/lib/utils";

export interface SplitStoryProps {
  eyebrow?: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  imageAlt?: string;
  reverse?: boolean;
  className?: string;
}

export function SplitStory({
  eyebrow,
  title,
  body,
  imageUrl,
  imageAlt = "",
  reverse = false,
  className,
}: SplitStoryProps) {
  return (
    <section className={cn("px-5 py-16 sm:px-8 lg:px-12 lg:py-24", className)}>
      <div
        className={cn(
          "mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2",
          reverse && "lg:[&>*:first-child]:order-2",
        )}
      >
        <div className="relative">
          <div className="absolute -left-4 -top-4 h-28 w-28 rounded-full bg-primary/15 blur-2xl" />
          <div className="overflow-hidden rounded-[2rem] border bg-muted shadow-xl">
            {imageUrl ? (
              <img src={imageUrl} alt={imageAlt} className="aspect-[5/4] w-full object-cover" />
            ) : (
              <div className="aspect-[5/4] bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.22),transparent_28%),hsl(var(--muted))]" />
            )}
          </div>
        </div>
        <div className="max-w-xl">
          {eyebrow ? (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-pretty text-lg leading-8 text-muted-foreground">{body}</p>
        </div>
      </div>
    </section>
  );
}
