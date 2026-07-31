# Commerce runtime guide

Use this directory as the storefront's only shopper-facing Swell integration
layer. Generated React source should import from `@/commerce` or the specific
barrels below; it must not call the Admin API, read generation-time secrets, or
create a parallel Swell client.

## Storefront state

- `StorefrontProvider` in `src/main.tsx` initializes `swell-js` from
  `window.__SWELL__`, which the Swell proxy injects into HTML.
- `useStorefront()` returns `status`, `error`, `currency`, `locale`,
  available currencies/locales, loaded menus, `refresh`, `setCurrency`, and
  `setLocale`.
- Render intentional loading, error, unconfigured, and empty states. Do not
  hardcode public keys or store ids.

## Products

Import from `@/commerce/products` or `@/commerce`.

- `useProducts(query, options?)` wraps `swell.products.list(query)` and returns
  a query result: `{ data, loading, isFetching, error, refetch }`. `data` is
  `{ products, count, page, pageCount, limit }`.
- Useful list queries: `{ limit: 8 }`, `{ limit: 12, page }`,
  `{ category: "category-slug" }`, `{ search: term }`, and
  `{ sort: "created_desc" }`.
- `useProduct(idOrSlug, query?)` wraps `swell.products.get()` for detail routes
  like `/products/:slug`; pass the slug from the URL.
- Product links should be `/products/${product.slug}` only when `slug` exists.
- `useProductSelection(product)` helps product detail pages manage variants,
  options, and purchasability before adding to cart.

## Categories

Import from `@/commerce/categories` or `@/commerce`.

- `useCategories(query, options?)` wraps `swell.categories.list(query)` and
  returns a query result: `{ data, loading, isFetching, error, refetch }`.
  `data` is `{ categories, count }`.
- `useCategory(idOrSlug, query?)` wraps `swell.categories.get()` for detail
  routes like `/categories/:slug`; pass the slug from the URL.
- Category links should be `/categories/${category.slug}` only when `slug`
  exists.

## Menus

Import from `@/commerce/menu` or `@/commerce`.

- `useMenus()` returns all normalized storefront menus loaded from settings.
- `useMenu(id?)` returns one menu's normalized items. If no id is provided, it
  uses the first available menu.
- Supported item output includes `name`, `href`, `type`, and optional nested
  `items`. Render unknown item types defensively.
- The generation-time `create_menu` tool creates menus; runtime source only
  reads and renders them.

## Cart

Import from `@/commerce/cart` or `@/commerce`.

- `useCart()` loads the current cart and returns `items`, `itemCount`,
  `subtotal`, `discountTotal`, `taxTotal`, `total`, `checkoutUrl`, `isLoading`,
  `error`, `addProduct`, `updateQuantity`, `removeItem`, `clearError`, and
  `format(amount)`.
- Product cards can call `addProduct(product)` for simple products.
- Product detail pages with required options should use `useProductSelection`
  and pass selected options to `addProduct(product, options)`.
- Use `checkoutUrl` for the checkout link when present.

## Currency and locale

Import from `@/commerce/currency` and `@/commerce/locale`.

- `useCurrency()` returns `code`, `available`, `setCurrency`, and
  `format(amount)`.
- `useLocale()` returns `code`, `available`, and `setLocale`.
- Always format prices with `useCurrency().format(...)` instead of manually
  concatenating symbols.

## Implementation rule

Prefer these documented exports. Read hook implementations only if a TypeScript
type or returned property is unclear from this guide and the barrel exports.
