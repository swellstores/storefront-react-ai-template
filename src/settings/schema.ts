import type { SettingsSchema } from "@swell/storefront-app-sdk-react";

// Base scaffold schema. `applyPlan` + `writeSettingsSchema` (vibesdk) regenerate
// this file per the plan during codegen — color roles and the design-token
// defaults are driven by the chosen style preset. This base mirrors the
// system defaults (the `contemporary` preset).
const schema = [
  {
    name: "Colors",
    settings: [
      {
        type: "color_scheme_group",
        id: "color_schemes",
        definition: [
          { type: "color", id: "background", label: "Background" },
          { type: "color", id: "text", label: "Text" },
          { type: "color", id: "surface", label: "Surface" },
          { type: "color", id: "muted", label: "Muted" },
          { type: "color", id: "border", label: "Border" },
          { type: "color", id: "button", label: "Button" },
          { type: "color", id: "button_label", label: "Button Label" },
          { type: "color", id: "secondary_button", label: "Secondary Button" },
          { type: "color", id: "secondary_button_label", label: "Secondary Button Label" },
          { type: "color", id: "accent", label: "Accent" },
        ],
      },
      { type: "color_scheme", id: "cart_color_scheme", label: "Cart color scheme" },
    ],
  },
  {
    name: "Typography",
    settings: [
      {
        type: "select",
        id: "font_pairing",
        label: "Fonts",
        default: "modern-grotesque",
        options: [
          { label: "Modern Grotesque", value: "modern-grotesque" },
          { label: "Editorial Serif", value: "editorial-serif" },
          { label: "Classic Serif", value: "classic-serif" },
          { label: "Warm Humanist", value: "warm-humanist" },
          { label: "Geometric Minimal", value: "geometric-minimal" },
          { label: "Bold Display", value: "bold-display" },
          { label: "Refined Sans", value: "refined-sans" },
          { label: "Friendly Rounded", value: "friendly-rounded" },
          { label: "Mono Accent", value: "mono-accent" },
          { label: "Elegant Contrast", value: "elegant-contrast" },
          { label: "Clean DM", value: "clean-dm" },
          { label: "Magazine", value: "magazine" },
        ],
      },
      {
        type: "select",
        id: "type_scale",
        label: "Type scale",
        default: "balanced",
        help: "How much headings stand out from body text.",
        options: [
          { label: "Modest", value: "modest" },
          { label: "Balanced", value: "balanced" },
          { label: "Dramatic", value: "dramatic" },
        ],
      },
      {
        type: "select",
        id: "type_weight",
        label: "Heading weight",
        default: "bold",
        options: [
          { label: "Regular", value: "regular" },
          { label: "Bold", value: "bold" },
          { label: "Heavy", value: "heavy" },
        ],
      },
    ],
  },
  {
    name: "Shape",
    settings: [
      {
        type: "select",
        id: "radius",
        label: "Corners",
        default: "rounded",
        options: [
          { label: "Sharp", value: "sharp" },
          { label: "Rounded", value: "rounded" },
          { label: "Pill", value: "pill" },
        ],
      },
      {
        type: "select",
        id: "edges",
        label: "Borders & shadows",
        default: "soft",
        options: [
          { label: "Flat", value: "flat" },
          { label: "Hairline", value: "hairline" },
          { label: "Soft", value: "soft" },
          { label: "Brutalist", value: "brutalist" },
        ],
      },
    ],
  },
  {
    name: "Layout & Motion",
    settings: [
      {
        type: "select",
        id: "density",
        label: "Spacing",
        default: "normal",
        options: [
          { label: "Compact", value: "compact" },
          { label: "Normal", value: "normal" },
          { label: "Spacious", value: "spacious" },
        ],
      },
      {
        type: "select",
        id: "motion_feel",
        label: "Motion",
        default: "elegant",
        options: [
          { label: "Playful", value: "playful" },
          { label: "Elegant", value: "elegant" },
          { label: "Snappy", value: "snappy" },
        ],
      },
    ],
  },
] satisfies SettingsSchema;

export default schema;
