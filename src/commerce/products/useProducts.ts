import type { Product, ProductQuery, ResultsResponse } from "swell-js";

import { swell } from "../client";
import { useStorefront } from "../provider";
import { stableQueryKey, useQuery, type QueryOptions, type QueryResult } from "../query";

export interface ProductsResult {
  products: Product[];
  count: number;
  page: number;
  pageCount: number;
  limit: number;
}

export function useProducts(
  query: ProductQuery = {},
  options: QueryOptions = { keepPreviousData: true },
): QueryResult<ProductsResult> {
  const { queryScope } = useStorefront();
  const key = queryScope ? `products|${queryScope}|${stableQueryKey(query)}` : "";

  return useQuery(
    key,
    async () => {
      const response = (await swell.products.list(query)) as ResultsResponse<Product>;

      return {
        products: response.results ?? [],
        count: response.count ?? 0,
        page: response.page ?? 1,
        pageCount: response.page_count ?? 1,
        limit: response.limit ?? query.limit ?? 0,
      };
    },
    options,
  );
}
