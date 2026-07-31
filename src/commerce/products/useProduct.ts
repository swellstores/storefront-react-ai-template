import type { Product, ProductQuery } from "swell-js";

import { swell } from "../client";
import { useStorefront } from "../provider";
import { stableQueryKey, useQuery, type QueryResult } from "../query";

const DEFAULT_PRODUCT_QUERY: ProductQuery = {
  expand: ["variants"],
  $recommendations: true,
};

export function useProduct(
  idOrSlug: string | undefined,
  query: ProductQuery = DEFAULT_PRODUCT_QUERY,
): QueryResult<Product> {
  const { queryScope } = useStorefront();
  const key =
    idOrSlug && queryScope ? `product|${idOrSlug}|${queryScope}|${stableQueryKey(query)}` : "";

  return useQuery(key, () => swell.products.get(idOrSlug!, query));
}
