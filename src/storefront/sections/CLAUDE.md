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
