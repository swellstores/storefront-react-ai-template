import type { SettingsSchema } from "@swell/storefront-app-sdk-react";

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
      {
        type: "color_scheme",
        id: "cart_color_scheme",
        label: "Cart color scheme",
      },
    ],
  },
] satisfies SettingsSchema;

export default schema;
