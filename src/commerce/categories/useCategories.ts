import type { Category, Query, ResultsResponse } from "swell-js";

import { swell } from "../client";
import { useStorefront } from "../provider";
import { stableQueryKey, useQuery, type QueryOptions, type QueryResult } from "../query";

export interface CategoriesResult {
  categories: Category[];
  count: number;
}

export function useCategories(
  query: Query = {},
  options?: QueryOptions,
): QueryResult<CategoriesResult> {
  const { queryScope } = useStorefront();
  const key = queryScope ? `categories|${queryScope}|${stableQueryKey(query)}` : "";

  return useQuery(
    key,
    async () => {
      const response = (await swell.categories.list(query)) as ResultsResponse<Category>;
      return {
        categories: response.results ?? [],
        count: response.count ?? 0,
      };
    },
    options,
  );
}

export function useCategory(
  idOrSlug: string | undefined,
  query: Query = {},
): QueryResult<Category> {
  const { queryScope } = useStorefront();
  const key =
    idOrSlug && queryScope ? `category|${idOrSlug}|${queryScope}|${stableQueryKey(query)}` : "";

  return useQuery(key, () => swell.categories.get(idOrSlug!, query));
}
