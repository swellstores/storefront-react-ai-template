# src/storefront/sections

Sections are agent-authored open compositions made from the closed block vocabulary.

Use sections to create the actual storefront experience: product heroes, product grids, editorial bands, navigation areas, cart layouts, and other page regions.

## Rules

- Import blocks from `@/storefront/blocks`.
- Import hooks from `@/hooks`.
- Do not import primitives directly.
- Do not edit blocks, primitives, hooks, or `@/lib/swell` from section work.
- Do not create section patterns or a reusable template-owned section library.
- Do not manually wire commerce actions; pass complete hook results into blocks.
- Do not unpack hook results just to reconnect callbacks already owned by blocks.
- Style sections with layout markup, Tailwind classes, and block `className` props.
- Change global visual tokens only through `src/theme.css` and `src/fonts.css`.

## File Shape

- Create one section component per file.
- Name files and components by section purpose, such as `HeroSection.tsx`,
  `ProductGridSection.tsx`, `ProductDetailSection.tsx`, or
  `CategoryHeaderSection.tsx`.
- Export the section component as a named export.
- Define a local props interface when the section accepts page context, such as a
  product slug, category slug, featured entity id, heading, or label.
- Do not create `src/storefront/sections/index.ts`.

## Data Ownership

Each section owns the data source it needs.

- Use `useProduct(slug)` for product detail, featured product, and quick-view sections.
- Use `useProducts(query)` for product grids, collections, search, filtering, sorting, and pagination.
- Use `useCategory(slug)` for category detail, featured category, and category product sections.
- Use `useCategories(query)` for category grids, category indexes, and category navigation sections.
- Use `useCart()` for cart triggers, cart drawers, cart lines, summaries, and checkout sections.
- Use `useMenu(id)` or `useMenus()` for navigation sections.
- Use `useCurrency()` and `useLocale()` for localization controls.

Sections may receive a slug or id from a page, derive it from route context, or use a fixed featured entity chosen during generation.

For category product sections, call `useCategory(slug)` and pass that complete result to category blocks. `useCategory()` already returns the selected category's products.

Use `SurfaceDrawer` for reusable drawer interactions such as cart drawers, mobile menus, and filter drawers. Do not import drawer primitives directly.

## Composition

Sections may use semantic HTML and normal layout elements to arrange blocks.

Pass whole hook results into blocks:

- `product={product}`
- `products={products}`
- `category={category}`
- `categories={categories}`
- `cart={cart}`
- `menu={menu}`
- `currency={currency}`
- `locale={locale}`

Do not pass deep fields or action callbacks unless a block explicitly asks for them.

## Editor contract (required on every section)

- The section root element MUST carry:
  - data-section-id="<stable-kebab-slug>"  (unique per section, derived
    from section purpose, stable across regenerations of the same plan)
  - data-section-type="<SectionComponentName>"
- Editable content MUST be marked where it renders:
  - data-editable="text"  on headings, body copy, button labels
  - data-editable="image" on content imagery
  - data-editable="link"  on CTAs and nav links
  - each data-editable element also carries data-prop="<name>"
    identifying what it renders
- If a block component does not forward data-* attributes, wrap it in a
  plain element carrying the mark. Never omit the mark.
- Never nest one data-section-id inside another.

## Design token adherence (hard rules)

- All colour via theme.css tokens only (the utilities backed by @theme).
  ZERO literal colours in section files: no hex, no oklch(), no rgb(),
  no raw Tailwind palette classes (bg-zinc-900, text-gray-500 etc).
- Fonts, radius, and shadows via tokens only. If a value you want has no
  token, use the nearest token; do not inline it.

## Composition rules (subset)

Structural/typographic floors (derived from the engine ui-guidelines).
Names below reference this template's real utilities: colour tokens
`bg-background`/`text-foreground`/`bg-primary`+`text-primary-foreground`/
`bg-muted`+`text-muted-foreground`/`bg-accent`+`text-accent-foreground`/
`border-border`/`ring-ring`; type `font-heading`/`font-sans`; radius
`rounded-sm…rounded-4xl` (backed by `--radius`); depth `shadow-sm/md/lg`.

Spacing & rhythm
- MUST take every spacing value from the standard Tailwind scale
  (`p-4`, `gap-6`, `py-24`…). NEVER one-off arbitrary values (`p-[13px]`,
  `gap-[7px]`, raw `padding: 13px`).
- MUST draw section vertical padding from one consistent scale repeated
  across every section of the page (e.g. a `py-16 / py-24 / py-32` rhythm).
- MUST keep a container's edge padding ≥ the gaps between its children.
- MUST use symmetric padding on tags/pills/badges (left=right, top=bottom).

Typography
- MUST keep body text ≥ 16px (`text-base` or larger); never below 12px
  anywhere. Body line-height 120–145%.
- MUST cap body-copy measure at 60–80ch (`max-w-prose` / `max-w-2xl`).
  NEVER full-width paragraphs.
- MUST differentiate heading from body on ≥2 axes (size, weight, colour) —
  size alone is not hierarchy. Headings use `font-heading`, body `font-sans`.
- MUST add positive tracking to all-caps labels; tighten tracking and
  leading as display size grows.
- NEVER more than two typefaces (this template ships `font-heading` +
  `font-sans`).

Imagery as content
- MUST use imagery depicting the store's actual offering (products,
  materials, process, setting named in the brief). NEVER generic unrelated
  stock.
- MUST declare one aspect ratio per context, identical across a grid
  (e.g. `aspect-[4/5]` for product cards).
- MUST emit explicit `width`/`height` and `alt` (`alt=""` if decorative)
  on every `<img>`.
- NEVER a lone image in an otherwise empty section without anchoring text
  or a frame.

Contrast
- MUST meet contrast floors against the actual rendered background:
  body/heading text ≥ 4.5:1, secondary/muted ≥ 3:1, text on filled or
  accent surfaces ≥ 4.5:1. Prefer designed token pairs
  (`bg-primary`+`text-primary-foreground`, `bg-muted`+`text-muted-foreground`,
  `bg-accent`+`text-accent-foreground`).
- MUST put a scrim behind text over imagery, sized so both floors pass
  against the worst-case region; NEVER rely on the image itself for contrast.
- MUST use one depth technique per storefront (border OR shadow OR
  background shift), never mixed.

Pull-quotes & blockquotes
- A quote uses EXACTLY ONE emphasis device: EITHER a vertical rule with the
  text left-aligned, OR centred text with no rule. NEVER both (no vertical
  rule on centred text, no left rule paired with centring).
- MUST carry an attribution line (source/author), visually subordinate to
  the quote (smaller and/or muted), not a bare floating quote.

Banned defaults (conformance)
zero-gap icon+text · unpadded bordered boxes · single-item grids ·
full-width paragraphs · literal `#000`/`#FFF` (or any literal colour) ·
one-off spacing values · asymmetric badge padding · adjacent hard divides ·
mixed depth techniques · text over imagery without scrim · more than two
typefaces · lone image in a void · irrelevant stock imagery ·
blockquote with both a rule and centred text · quote with no attribution.

## Taste

- Obey the selected taste's never-rules without exception. Do not
  regress to mean defaults on any axis the brief or taste has an
  opinion about.
