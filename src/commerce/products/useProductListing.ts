import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Category, Product, ProductQuery, ResultsResponse } from "swell-js";

import { swell } from "../client";
import { useCurrency } from "../currency";
import { useStorefront } from "../provider";
import { stableQueryKey, useQuery } from "../query";
import { useProducts } from "./useProducts";

const FILTER_SAMPLE_LIMIT = 100;
const DEFAULT_LIMIT = 24;

export interface ProductListingSortOption {
  value: string;
  label: string;
  sort: string;
}

export const PRODUCT_LISTING_SORT_OPTIONS: ProductListingSortOption[] = [
  { value: "featured", label: "Featured", sort: "" },
  { value: "newest", label: "Newest", sort: "date_created desc" },
  { value: "price_asc", label: "Price: low to high", sort: "price asc" },
  { value: "price_desc", label: "Price: high to low", sort: "price desc" },
];

export interface ListingFilterItem {
  label: string;
  value: string;
  active: boolean;
  select: () => void;
}

export interface ListingAttributeFilter {
  id: string;
  label: string;
  items: ListingFilterItem[];
}

export interface ListingPriceFilter {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  set: (value: [number, number]) => void;
  label: string;
}

interface RawFilter {
  id: string;
  label: string;
  type: "range" | "select";
  options: Array<{ value: string | number; label: string | number }>;
}

interface FilterMetadata {
  categories: Category[];
  filters: RawFilter[];
}

export function useProductListing(input: {
  defaultLimit?: number;
  pageSizeOptions?: number[];
  sortOptions?: ProductListingSortOption[];
} = {}) {
  const defaultLimit = input.defaultLimit ?? DEFAULT_LIMIT;
  const sortOptions = input.sortOptions ?? PRODUCT_LISTING_SORT_OPTIONS;
  const [searchParams, setSearchParams] = useSearchParams();
  const { queryScope } = useStorefront();
  const { format } = useCurrency();

  const page = positiveInt(searchParams.get("page"), 1);
  const limit = positiveInt(searchParams.get("limit"), defaultLimit);
  const category = searchParams.get("category") ?? "";
  const search = searchParams.get("search") ?? "";
  const sortValue = searchParams.get("sort") ?? sortOptions[0]?.value ?? "";
  const sort = sortOptions.find((option) => option.value === sortValue)?.sort ?? "";
  const minPrice = searchParams.get("min") ?? "";
  const maxPrice = searchParams.get("max") ?? "";

  const metadataKey = queryScope ? `product-listing-metadata|${queryScope}` : "";
  const metadata = useQuery<FilterMetadata>(metadataKey, async () => {
    const [categoriesResponse, sampleResponse] = await Promise.all([
      swell.categories.list() as Promise<ResultsResponse<Category>>,
      swell.products.list({ limit: FILTER_SAMPLE_LIMIT }) as Promise<ResultsResponse<Product>>,
    ]);
    const sample = sampleResponse.results ?? [];
    const rawFilters = ((await swell.products.filters(sample)) ?? []) as RawFilter[];
    return {
      categories: categoriesResponse.results ?? [],
      filters: mergeOptionFilters(rawFilters, sample),
    };
  });

  const selectFilters = (metadata.data?.filters ?? []).filter((filter) => filter.type === "select");
  const activeFilters = useMemo(() => {
    const filters: Record<string, unknown> = {};
    if (minPrice || maxPrice) {
      filters.price = [minPrice ? Number(minPrice) : null, maxPrice ? Number(maxPrice) : null];
    }
    for (const filter of selectFilters) {
      const value = searchParams.get(filter.id);
      if (value) filters[filter.id] = value;
    }
    return filters;
  }, [maxPrice, minPrice, searchParams, selectFilters]);

  const query: ProductQuery = {
    limit,
    page,
    ...(category ? { category } : {}),
    ...(search ? { search } : {}),
    ...(sort ? { sort } : {}),
    ...(Object.keys(activeFilters).length > 0 ? ({ $filters: activeFilters } as ProductQuery) : {}),
  };

  const products = useProducts(query, { keepPreviousData: true });

  const setParam = useCallback(
    (keyOrValues: string | Record<string, string>, value?: string) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.delete("page");
        const values =
          typeof keyOrValues === "string" ? { [keyOrValues]: value ?? "" } : keyOrValues;
        for (const [key, nextValue] of Object.entries(values)) {
          if (nextValue) next.set(key, nextValue);
          else next.delete(key);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        if (nextPage <= 1) next.delete("page");
        else next.set("page", String(nextPage));
        return next;
      });
    },
    [setSearchParams],
  );

  const priceFilter = buildPriceFilter(metadata.data?.filters ?? [], minPrice, maxPrice, setParam, format);
  const categoryItems = (metadata.data?.categories ?? []).map((item) => ({
    label: item.name ?? item.slug ?? "Category",
    value: item.slug ?? "",
    active: category === item.slug,
    select: () => setParam("category", category === item.slug ? "" : item.slug ?? ""),
  }));
  const attributeFilters = selectFilters.map((filter) => ({
    id: filter.id,
    label: filter.label,
    items: filter.options.map((option) => {
      const value = String(option.value);
      return {
        label: String(option.label),
        value,
        active: searchParams.get(filter.id) === value,
        select: () => setParam(filter.id, searchParams.get(filter.id) === value ? "" : value),
      };
    }),
  }));
  const activeFilterCount =
    (category ? 1 : 0) +
    (search ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    selectFilters.filter((filter) => searchParams.get(filter.id)).length;

  return {
    products: products.data?.products ?? [],
    count: products.data?.count ?? 0,
    loading: metadata.loading || products.loading,
    isFetching: metadata.isFetching || products.isFetching,
    error: metadata.error ?? products.error,
    query,
    queryKey: stableQueryKey(query),
    search,
    setSearch: (value: string) => setParam("search", value),
    category,
    categories: categoryItems,
    priceFilter,
    attributeFilters,
    activeFilterCount,
    hasActiveFilters: activeFilterCount > 0,
    clearFilters: () => setSearchParams(new URLSearchParams()),
    sort: {
      value: sortValue,
      options: sortOptions.map(({ value, label }) => ({ value, label })),
      set: (value: string) => setParam("sort", value),
    },
    pageSize: input.pageSizeOptions
      ? {
          value: limit,
          options: input.pageSizeOptions,
          set: (value: number) => setParam("limit", value === defaultLimit ? "" : String(value)),
        }
      : null,
    pagination: {
      page: products.data?.page ?? page,
      pageCount: products.data?.pageCount ?? 1,
      limit,
      hasPrevious: page > 1,
      hasNext: page < (products.data?.pageCount ?? 1),
      setPage,
    },
  };
}

function buildPriceFilter(
  filters: RawFilter[],
  minPrice: string,
  maxPrice: string,
  setParam: (values: Record<string, string>) => void,
  format: (amount: number | null | undefined) => string,
): ListingPriceFilter | null {
  const price = filters.find((filter) => filter.id === "price" && filter.type === "range");
  if (!price) return null;
  const min = Number(price.options[0]?.value ?? 0);
  const max = Number(price.options[1]?.value ?? min);
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return null;
  const value: [number, number] = [minPrice ? Number(minPrice) : min, maxPrice ? Number(maxPrice) : max];
  return {
    min,
    max,
    step: 1,
    value,
    set: ([low, high]) => setParam({ min: String(low), max: String(high) }),
    label: `${format(value[0])} – ${format(value[1])}`,
  };
}

function mergeOptionFilters(rawFilters: RawFilter[], products: Product[]): RawFilter[] {
  const seen = new Set(rawFilters.map((filter) => filter.id));
  const derived = new Map<string, { label: string; values: Set<string> }>();

  for (const product of products) {
    for (const option of product.options ?? []) {
      if (!option.name || !option.values?.length) continue;
      const id = option.name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
      if (seen.has(id)) continue;
      const entry = derived.get(id) ?? { label: option.name, values: new Set<string>() };
      for (const value of option.values) {
        if (value.name) entry.values.add(value.name);
      }
      derived.set(id, entry);
    }
  }

  return [
    ...rawFilters,
    ...[...derived.entries()]
      .filter(([, entry]) => entry.values.size >= 2)
      .map(([id, entry]) => ({
        id,
        label: entry.label,
        type: "select" as const,
        options: [...entry.values].map((value) => ({ value, label: value })),
      })),
  ];
}

function positiveInt(raw: string | null, fallback: number): number {
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}
