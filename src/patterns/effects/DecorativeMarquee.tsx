import { cn } from "@/lib/utils";

export interface DecorativeMarqueeProps {
  items: string[];
  className?: string;
  reverse?: boolean;
}

export function DecorativeMarquee({ items, className, reverse = false }: DecorativeMarqueeProps) {
  const safeItems = items.length ? items : ["New arrivals", "Curated goods"];

  return (
    <div
      className={cn("group overflow-hidden border-y bg-foreground py-3 text-background", className)}
    >
      <div
        className={cn(
          "animate-marquee flex w-max min-w-full items-center gap-8 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.34em]",
          reverse && "motion-safe:[animation-direction:reverse]",
        )}
      >
        {[...safeItems, ...safeItems, ...safeItems].map((item, index) => (
          <span className="flex items-center gap-8" key={`${item}-${index}`}>
            <span>{item}</span>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-background/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
