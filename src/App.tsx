import {
  SwellStorefrontApp,
  type PageDeclaration,
  type PageTemplate,
} from "@swell/storefront-app-sdk-react";
import swellConfig from "@swell-config";

import { SECTIONS } from "@/sections";
import settingsSchema from "@/settings/schema";
import settingsValues from "@theme/settings/settings.json";
import footer from "@theme/templates/layout/footer.json";
import header from "@theme/templates/layout/header.json";

// Inline every page template at build time — eager glob makes them sync
// references on the SDK side and lets Vite tree-shake unused JSON.
const pageTemplateModules = import.meta.glob<PageTemplate>("@theme/templates/pages/*.json", {
  eager: true,
  import: "default",
});

const pageTemplates: Record<string, PageTemplate> = Object.fromEntries(
  Object.entries(pageTemplateModules).map(([path, template]) => {
    const id = path.match(/\/([^/]+)\.json$/)?.[1] ?? "";
    return [id, template];
  }),
);

const localeModules = import.meta.glob<Record<string, unknown>>("@theme/locales/*.json", {
  eager: true,
  import: "default",
});

const locales: Record<string, Record<string, unknown>> = Object.fromEntries(
  Object.entries(localeModules).map(([path, dict]) => {
    const code = path.match(/\/([^/]+)\.json$/)?.[1]?.replace(/\.default$/, "") ?? "";
    return [code, dict];
  }),
);

interface SwellConfigPage {
  id: string;
  label: string;
  url: string;
  collection?: PageDeclaration["collection"];
}

interface SwellConfig {
  storefront?: {
    theme?: {
      pages?: SwellConfigPage[];
      defaultLocale?: string;
    };
  };
}

const declaredPages: SwellConfigPage[] =
  (swellConfig as SwellConfig).storefront?.theme?.pages ?? [];

const defaultLocale = (swellConfig as SwellConfig).storefront?.theme?.defaultLocale;

// Combine routing manifest (from swell.json) with content (from per-page
// template JSONs) into the SDK's expected PageDeclaration[] shape.
const pages: PageDeclaration[] = declaredPages.flatMap((p) => {
  const template = pageTemplates[p.id];
  if (!template) return [];
  return [
    {
      id: p.id,
      url: p.url,
      collection: p.collection,
      template,
    },
  ];
});

export default function App() {
  return (
    <SwellStorefrontApp
      pages={pages}
      components={{ sections: SECTIONS }}
      settings={{ schema: settingsSchema, values: settingsValues }}
      locales={locales}
      defaultLocale={defaultLocale}
      header={header}
      footer={footer}
      devPreview={import.meta.env.VITE_SWELL_DEV_PREVIEW === "1"}
    />
  );
}
