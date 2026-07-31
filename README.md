# storefront-react-ai-template

React storefront template for the Swell AI generation pipeline.

The template is the storefront root. There is no `app/frontend` nesting,
Swell App runtime, theme JSON renderer, section registry, schema runtime, or
dependency on `@swell/storefront-app-sdk-*`.

## Development

```sh
bun install
bun dev
bun run build
```

Storefront identity is supplied by the Swell platform proxy. The worker reads
public Swell headers from each request and injects them as `window.__SWELL__`.

## UI source

The storefront owns its shadcn UI source under `src/components/ui`. Components
use the Radix primitives, Lucide icons, Tailwind CSS 4, and editable
`src/design.css` tokens. Motion-heavy generated designs may also use
`framer-motion` directly.

The template includes:

```text
accordion       alert-dialog    aspect-ratio    badge
button          card            carousel        checkbox
dialog          drawer          dropdown-menu   hover-card
input           label           navigation-menu popover
radio-group     scroll-area     select          separator
sheet           skeleton        slider          sonner
switch          tabs            textarea        toggle
toggle-group    tooltip
```

Import components individually:

```tsx
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
```

`TooltipProvider` and the global `Toaster` are already mounted in
`src/main.tsx`. Add more shadcn source later with:

```sh
bunx --bun shadcn@latest add <component>
```

## Commerce source

All commerce behavior is ordinary app source under `src/commerce`. Generated
storefronts can import it, inspect it, and change it without crossing a package
boundary.

```text
src/commerce
├── products
├── categories
├── menu
├── currency
├── locale
├── cart
├── client.ts
├── provider.tsx
└── query.ts
```

`StorefrontProvider` initializes `swell-js`, loads menus/currencies/locales,
and creates a currency/locale-aware query scope. It does not own routing,
layout, or presentation.

### Products

```tsx
import { useProduct, useProducts, useProductSelection } from "@/commerce/products";

const { data, loading, error, refetch } = useProducts({
  category: "equipment",
  limit: 24,
  page: 1,
});

const products = data?.products ?? [];
const pageCount = data?.pageCount ?? 1;

const { data: product } = useProduct(slug);
const selection = useProductSelection(product);
```

`useProducts` returns a query result whose `data` is
`{ products, count, page, pageCount, limit }`.
`useProductSelection` owns editable option, purchase option, quantity, and
variation state for a product detail page.

### Categories and menus

```tsx
import { useCategories, useCategory } from "@/commerce/categories";
import { useMenu, useMenus } from "@/commerce/menu";

const { data } = useCategories();
const categories = data?.categories ?? [];
const { data: category } = useCategory(slug);
const navigation = useMenu("header");
```

`useCategories` returns a query result whose `data` is `{ categories, count }`.
Menu items are normalized to `{ name, href, type, items }`. No dropdown,
drawer, hover, or focus behavior is imposed on the generated UI.

### Currency and locale

```tsx
import { useCurrency } from "@/commerce/currency";
import { useLocale } from "@/commerce/locale";

const { code, available, setCurrency, format } = useCurrency();
const { code: locale, available: locales, setLocale } = useLocale();
```

Changing either value updates the query scope, so product/category hooks fetch
fresh localized data. Currency and locale controls remain app-owned.

### Cart

```tsx
import { useCart } from "@/commerce/cart";

const { cart, items, itemCount, total, format, addProduct, updateQuantity, removeItem, error } =
  useCart();

await addProduct(product, {
  options: selection.options,
  purchaseOption: selection.purchaseOption,
  quantity: selection.quantity,
});
```

The hook exposes both the raw Swell cart and render-friendly line data.
Mutations reject on API errors and also expose the latest error in state, so
the generated UI decides how errors are presented.

## App ownership

- `src/App.tsx` and all visual components are generated React code.
- `src/design.css` and Tailwind remain app-owned.
- `src/commerce` contains editable defaults, not a protected framework.
- `worker/*` only serves assets and injects public Swell client config.
- Future account, checkout, payment, subscription, and invoice support can be
  added later without changing the current storefront generation contract.
