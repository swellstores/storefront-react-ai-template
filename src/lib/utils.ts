/**
 * `cn` is re-exported from the SDK so there is ONE implementation: the SDK owns
 * the design-token font-size utilities (`text-display` / `text-heading`) and
 * registers them with tailwind-merge there, so merging a size with a color
 * (e.g. `cn("text-heading", isOpen && "text-accent")`) keeps both instead of
 * silently dropping the size. Keeping a local copy here would let the two drift.
 */
export { cn } from "@swell/storefront-app-sdk-react";
