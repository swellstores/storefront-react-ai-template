import animate from "tailwindcss-animate";
import { SDK_TAILWIND_SAFELIST } from "@swell/storefront-app-sdk-react/tailwind";

/**
 * Color tokens map 1:1 to the canonical scheme CSS variables emitted by
 * @swell/storefront-app-sdk-core's ColorSchemeManager. The plan's design
 * agent declares the same 10 roles per color_scheme; values flow through
 * `[data-color-scheme="..."]` blocks at runtime. shadcn aliases (primary,
 * secondary, card, popover, accent, muted, foreground, input, ring) bind
 * to those scheme roles so shadcn primitives inherit the brand.
 *
 * stampTailwindConfig regenerates this file after each plan run, picking up
 * brand-extension roles (any keys the design agent adds beyond the canonical
 * 10) as auto-exposed Tailwind classes alongside the shadcn slots.
 */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: SDK_TAILWIND_SAFELIST,
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        text: "var(--text)",
        surface: "var(--surface)",
        muted: "var(--muted)",
        border: "var(--border)",
        button: "var(--button)",
        "button-label": "var(--button-label)",
        "secondary-button": "var(--secondary-button)",
        "secondary-button-label": "var(--secondary-button-label)",
        accent: "var(--accent)",

        foreground: "var(--text)",
        "muted-foreground": "var(--muted)",
        "accent-foreground": "var(--button-label)",
        primary: {
          DEFAULT: "var(--button)",
          foreground: "var(--button-label)",
        },
        secondary: {
          DEFAULT: "var(--secondary-button)",
          foreground: "var(--secondary-button-label)",
        },
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
        },
        popover: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
        },
        input: "var(--border)",
        ring: "var(--button)",
        destructive: {
          DEFAULT: "oklch(0.55 0.22 27)",
          foreground: "#fff",
        },
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
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
