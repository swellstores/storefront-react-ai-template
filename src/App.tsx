import { type ComponentType } from "react";
import { Routes, Route } from "react-router-dom";
import {
  SwellStorefrontApp,
  type PageTemplate,
} from "@swell/storefront-app-sdk-react";
import { Toaster } from "sonner";

import { SECTIONS } from "@/sections";
import settingsSchema from "@/settings/schema";
import settingsValues from "@theme/settings/settings.json";
import enLocale from "@theme/locales/en.default.json";
import header from "@theme/templates/layout/header.json";
import footer from "@theme/templates/layout/footer.json";
import swellConfig from "@swell-config";

import { NotFound } from "@/components/NotFound";
import HomePage from "@/pages/HomePage";
import ProductListPage from "@/pages/ProductListPage";
import ProductPage from "@/pages/ProductPage";
import StaticPage from "@/pages/StaticPage";

// Each template JSON declares its archetype under `page.archetype`. SDK's
// PageTemplate type doesn't model it, so we widen locally.
type PageArchetype = "home" | "product-list" | "product-detail" | "static";
type LocalPageTemplate = PageTemplate & {
  page?: PageTemplate["page"] & { archetype?: PageArchetype };
};

interface PageDeclaration {
  id: string;
  label: string;
  url: string;
  collection?: string;
}

// Build a manifest of page templates discovered at build time so routes can
// be wired purely from swell.json's `pages` registry. Eager glob inlines the
// JSON at the call site — no async fetch.
const pageTemplateModules = import.meta.glob<LocalPageTemplate>(
  "@theme/templates/pages/*.json",
  { eager: true, import: "default" },
);

const pageTemplates: Record<string, LocalPageTemplate> = Object.fromEntries(
  Object.entries(pageTemplateModules).map(([path, template]) => {
    const id = path.match(/\/([^/]+)\.json$/)?.[1] ?? "";
    return [id, template];
  }),
);

const archetypeToComponent: Record<
  PageArchetype,
  ComponentType<{ content: PageTemplate }>
> = {
  home: HomePage,
  "product-list": ProductListPage,
  "product-detail": ProductPage,
  static: StaticPage,
};

interface SwellConfig {
  storefront?: {
    theme?: {
      pages?: PageDeclaration[];
    };
  };
}

const declaredPages: PageDeclaration[] =
  (swellConfig as SwellConfig).storefront?.theme?.pages ?? [];

export default function App() {
  return (
    <SwellStorefrontApp
      components={{ sections: SECTIONS }}
      settings={{ schema: settingsSchema, values: settingsValues }}
      locales={{ "en-US": enLocale, en: enLocale }}
      header={header}
      footer={footer}
    >
      <Routes>
        {declaredPages.map((page) => {
          const template = pageTemplates[page.id];
          if (!template) return null;
          const archetype = template.page?.archetype;
          if (!archetype) return null;
          const Component = archetypeToComponent[archetype];
          if (!Component) return null;
          return (
            <Route
              key={page.id}
              path={page.url}
              element={<Component content={template} />}
            />
          );
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors closeButton />
    </SwellStorefrontApp>
  );
}
