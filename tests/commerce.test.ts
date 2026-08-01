import { describe, expect, test } from "bun:test";
import type { Product } from "swell-js";

import { buildCartItemPayload } from "../src/commerce/cart";
import { normalizeMenus } from "../src/commerce/menu/normalize";
import { getProductImageUrl, getProductPrice } from "../src/commerce/rendering";
import { stableQueryKey } from "../src/commerce/query";

describe("commerce helpers", () => {
  test("normalizes nested Swell menu links", () => {
    const menus = normalizeMenus([
      {
        id: "header",
        name: "Header",
        items: [
          {
            type: "category",
            name: "Shoes",
            value: { slug: "shoes" },
            items: [
              {
                type: "product",
                name: "Runner",
                value: { slug: "runner" },
              },
            ],
          },
        ],
      },
    ]);

    expect(menus.header?.items[0]).toEqual({
      name: "Shoes",
      type: "category",
      href: "/categories/shoes",
      children: [
        {
          name: "Runner",
          type: "product",
          href: "/products/runner",
          children: [],
          items: [],
        },
      ],
      items: [
        {
          name: "Runner",
          type: "product",
          href: "/products/runner",
          children: [],
          items: [],
        },
      ],
    });
  });

  test("reads render-friendly product image and price details", () => {
    const product = {
      name: "Runner",
      price: 120,
      sale_price: 90,
      currency: "USD",
      images: [{ file: { url: "https://cdn.test/runner.jpg" } }],
    } satisfies Product;

    expect(getProductImageUrl(product)).toBe("https://cdn.test/runner.jpg");
    expect(getProductPrice(product)).toEqual({
      price: 120,
      salePrice: 90,
      currency: "USD",
      hasSale: true,
    });
  });

  test("builds a cart payload with the matching variant", () => {
    const product = {
      id: "product-id",
      name: "Runner",
      options: [
        {
          id: "color",
          name: "Color",
          variant: true,
          values: [
            { id: "black", name: "Black" },
            { id: "white", name: "White" },
          ],
        },
      ],
      variants: {
        count: 1,
        limit: 10,
        page: 1,
        results: [{ id: "black-variant", option_value_ids: ["black"] }],
      },
    } satisfies Product;

    expect(
      buildCartItemPayload(product, {
        options: { color: "Black" },
        quantity: 2,
      }),
    ).toMatchObject({
      product_id: "product-id",
      variant_id: "black-variant",
      quantity: 2,
    });
  });

  test("creates stable query keys regardless of object key order", () => {
    expect(stableQueryKey({ page: 1, category: "shoes" })).toBe(
      stableQueryKey({ category: "shoes", page: 1 }),
    );
  });
});
