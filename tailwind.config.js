import animate from "tailwindcss-animate";
import { SDK_TAILWIND_SAFELIST } from "@swell/storefront-app-sdk-react/tailwind";

/**
 * Color tokens map 1:1 to the canonical scheme CSS variables emitted by
 * @swell/storefront-app-sdk-core's ColorSchemeManager. The plan's design
 * agent declares the same 7 pairs + border per color_scheme; values flow
 * through `[data-color-scheme="..."]` blocks at runtime. shadcn aliases
 * (primary, secondary, card, popover, accent, muted, foreground, input,
 * ring, destructive) bind to those scheme roles so shadcn primitives
 * inherit the brand.
 *
 * stampTailwindConfig regenerates this file after each plan run, picking up
 * brand-extension roles (any keys the design agent adds beyond the canonical
 * set) as auto-exposed Tailwind classes alongside the shadcn slots.
 *
 * Three shadcn slots are SERVICE SLOTS derived per a per-look policy
 * (calm|loud) rather than a fixed role — this file mirrors the DEFAULT look
 * (`gallery`, calm): interactive `--accent`/`--accent-foreground` read
 * `muted`/`muted_label` (quiet hover), `--ring` is always `accent` (the
 * focus ring is a legitimate brand moment), `--input` reads `border`.
 * `destructive`/`destructive-foreground` map to the palette
 * `destructive`/`destructive_label` roles — no hardcoded oklch literal.
 */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: SDK_TAILWIND_SAFELIST,
  theme: {
    extend: {
      colors: {
        // Custom role aliases — 1:1 with the canonical scheme roles.
        background: "var(--background)",
        text: "var(--text)",
        surface: "var(--surface)",
        "surface-label": "var(--surface-label)",
        muted: "var(--muted)",
        "muted-label": "var(--muted-label)",
        border: "var(--border)",
        button: "var(--button)",
        "button-label": "var(--button-label)",
        "secondary-button": "var(--secondary-button)",
        "secondary-button-label": "var(--secondary-button-label)",
        accent: "var(--accent)",
        "accent-label": "var(--accent-label)",
        destructive: "var(--destructive)",
        "destructive-label": "var(--destructive-label)",

        // shadcn semantic slots — see buildShadcnAliases in
        // packages/storefront-gen/src/storefront/codegen/stamp/tailwindConfig.ts.
        foreground: "var(--text)",
        primary: "var(--button)",
        "primary-foreground": "var(--button-label)",
        secondary: "var(--secondary-button)",
        "secondary-foreground": "var(--secondary-button-label)",
        card: "var(--surface)",
        "card-foreground": "var(--surface-label)",
        popover: "var(--surface)",
        "popover-foreground": "var(--surface-label)",
        // Interactive service slot — DEFAULT look (gallery) is calm: reads
        // muted/muted_label for a quiet hover, not the brand accent. This
        // deliberately overrides the "accent" custom-role alias above (the
        // brand accent stays reachable via the "accent" role for
        // brand-declared usage; shadcn's --accent is a distinct interactive
        // service slot, matching buildShadcnAliases's key-collision order).
        accent: "var(--muted)",
        "accent-foreground": "var(--muted-label)",
        "muted-foreground": "var(--muted-label)",
        // Service slots: input reads border; ring is always the brand accent.
        input: "var(--border)",
        ring: "var(--accent)",
        "destructive-foreground": "var(--destructive-label)",
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
      // Design-token utilities — mirror stamp/tailwindConfig.ts so pre-generation
      // dev (and the shadcn primitives that consume them) match generated apps.
      // The --font-*/--text-*/--edge-*/--flow-* vars come from src/fonts.css +
      // the SDK DesignTokenManager.
      fontFamily: {
        sans: ["var(--font-body, ui-sans-serif, system-ui, sans-serif)"],
        body: ["var(--font-body, ui-sans-serif, system-ui, sans-serif)"],
        display: ["var(--font-display, var(--font-body, ui-sans-serif, system-ui, sans-serif))"],
      },
      fontSize: {
        display: [
          "var(--text-display, 3rem)",
          {
            lineHeight: "1.05",
            letterSpacing: "var(--tracking-display, -0.02em)",
            fontWeight: "var(--font-display-weight, 700)",
          },
        ],
        heading: [
          "var(--text-heading, 1.875rem)",
          {
            lineHeight: "1.2",
            letterSpacing: "var(--tracking-heading, -0.01em)",
            fontWeight: "var(--font-heading-weight, 700)",
          },
        ],
        title: ["var(--text-title, 1.25rem)", { lineHeight: "1.3" }],
        body: ["var(--text-body, 1rem)", { lineHeight: "1.5" }],
        caption: ["var(--text-caption, 0.8125rem)", { lineHeight: "1.4" }],
      },
      boxShadow: {
        edge: "var(--edge-shadow, 0 4px 16px rgb(0 0 0 / 0.08))",
        "edge-lg": "var(--edge-shadow-lg, 0 12px 32px rgb(0 0 0 / 0.12))",
      },
      borderWidth: {
        edge: "var(--edge-border-width, 1px)",
      },
      spacing: {
        "flow-sm": "var(--flow-sm, 0.75rem)",
        flow: "var(--flow, 1.5rem)",
        "flow-lg": "var(--flow-lg, 3rem)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};
