import type { SectionRegistry } from "@swell/storefront-app-sdk-react";

// Section registry — populated when sections are added.
// Each entry: { component, blocks, schema }
//   component — section React component (uses <Slot name="..."> for blocks)
//   blocks    — block components keyed by block type (optional for data-only sections)
//   schema    — declarative metadata for the editor (optional)
export const SECTIONS: SectionRegistry = {};
