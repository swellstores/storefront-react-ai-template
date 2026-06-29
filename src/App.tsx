import { createStorefront } from "@swell/storefront-app-sdk-react";
import type { PageTemplate } from "@swell/storefront-app-sdk-react";
import { SECTIONS } from "@/sections";
import settingsSchema from "@/settings/schema";
import settingsValues from "@theme/settings/settings.json";
import footer from "@theme/templates/layout/footer.json";
import header from "@theme/templates/layout/header.json";
import swellConfig from "@swell-config";

// import.meta.glob is bundler-bound (Vite resolves it at transform time
// against THIS file's location). The SDK cannot do this glob on behalf of
// the app — keep the glob calls here, pass results to createStorefront().
const pageTemplateModules = import.meta.glob<PageTemplate>(
  "@theme/templates/pages/*.json",
  { eager: true, import: "default" },
);
const localeModules = import.meta.glob<Record<string, unknown>>(
  "@theme/locales/*.json",
  { eager: true, import: "default" },
);

export default createStorefront({
  swellConfig,
  pageTemplateModules,
  localeModules,
  sections: SECTIONS,
  settingsSchema,
  settingsValues,
  header,
  footer,
});
