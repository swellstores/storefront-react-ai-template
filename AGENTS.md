# Swell storefront template agent contract

This template is a curated pattern-driven storefront system. The agent is a
creative director and configurator, not a frontend component author.

## What to do

1. Read the merchant brief.
2. Choose one store archetype.
3. Choose one compatible token preset.
4. Choose page patterns for the requested pages.
5. Choose section patterns allowed by those page patterns.
6. Use real products, categories, and menus from generation-time commerce tools.
7. Write the selected storefront recipe to `storefront.recipe.json`.
8. Record the reasoning in `.agent/storefront-gen/design.md`.

## What not to do

- Do not create new React components during normal generation.
- Do not create new commerce clients, data hooks, or Swell API wrappers.
- Do not hardcode public keys, Admin sessions, store IDs, or storefront IDs.
- Do not generate a new Tailwind/CSS design system.
- Do not copy code from third-party UI libraries into generated output.
- Do not inspect implementation files to rediscover documented contracts.

If the template does not expose a needed pattern, choose the closest available
one and note the gap in `design.md`.

## Registry source of truth

Use these typed registry files as the template contract:

- `src/storefront/registry/archetypes.ts`
- `src/storefront/registry/tokenPresets.ts`
- `src/storefront/registry/pagePatterns.ts`
- `src/storefront/registry/sectionPatterns.ts`

The recipe schema and validator live in:

- `src/storefront/recipe/schema.ts`
- `src/storefront/recipe/validateRecipe.ts`

The configurable recipe file is:

- `storefront.recipe.json`

The current starting archetypes are:

- `brand_story` — sells through atmosphere, story, taste, curation, craft, and
  brand feeling.
- `catalog_shop` — sells through clear browsing, categories, filters,
  comparison, and low-friction shopping.
- `campaign_launch` — sells through a launch, drop, seasonal moment,
  promotion, urgency, or expressive campaign.
- `product_expert` — sells through education, proof, specs, benefits, and trust
  for high-consideration products.

## Commerce rules

Runtime storefront source must use the existing `@/commerce` modules. Do not
call the Admin API from storefront code.

Generation-time catalog and navigation decisions should use the provided
commerce tools. Do not invent product, category, or menu data.

## Design decision record

Keep `.agent/storefront-gen/design.md` compact:

- selected archetype;
- selected token preset;
- selected page and section patterns;
- real product/category/menu sources used;
- brief signals that justified the choices;
- missing pattern gaps, if any.
