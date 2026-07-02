import type { SettingsSchema } from "@swell/storefront-app-sdk-react";

// Base scaffold schema. `stampSettingsSchema` regenerates this file per the plan
// during codegen — color roles (7 pairs + border) are driven by the chosen
// look. This base mirrors the system defaults (the DEFAULT `gallery` look).
// The editable surface is EXACTLY {colour, font} — motion/radius/density are
// look-stamped foundation.css vars, not editor settings.
const schema = [
  {
    name: "Colors",
    settings: [
      {
        type: "color_scheme_group",
        id: "color_schemes",
        definition: [
          { type: "header", label: "Canvas" },
          { type: "color", id: "background", label: "Background" },
          { type: "color", id: "text", label: "Text" },
          { type: "header", label: "Surfaces" },
          { type: "color", id: "surface", label: "Surface" },
          { type: "color", id: "surface_label", label: "Surface Label" },
          { type: "color", id: "muted", label: "Muted" },
          { type: "color", id: "muted_label", label: "Muted Label" },
          { type: "header", label: "Buttons" },
          { type: "color", id: "button", label: "Button" },
          { type: "color", id: "button_label", label: "Button Label" },
          { type: "color", id: "secondary_button", label: "Secondary Button" },
          { type: "color", id: "secondary_button_label", label: "Secondary Button Label" },
          { type: "header", label: "Accent" },
          { type: "color", id: "accent", label: "Accent" },
          { type: "color", id: "accent_label", label: "Accent Label" },
          { type: "header", label: "Feedback" },
          { type: "color", id: "destructive", label: "Destructive" },
          { type: "color", id: "destructive_label", label: "Destructive Label" },
          { type: "header", label: "Lines" },
          { type: "color", id: "border", label: "Border" },
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
    ],
  },
] satisfies SettingsSchema;

export default schema;
