import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product, ProductOption } from "swell-js";

import { swell } from "../client";

export type PurchaseOptionSelection =
  | { type: "standard" }
  | { type: "subscription"; plan_id: string };

export function getActiveOptions(product: Product): ProductOption[] {
  return product.options?.filter((option) => option.active !== false) ?? [];
}

export function requiresProductOptions(product: Product): boolean {
  return getActiveOptions(product).some((option) => option.variant);
}

export function getDefaultOptions(product: Product): Record<string, string> {
  const selection: Record<string, string> = {};

  for (const option of getActiveOptions(product)) {
    const firstValue = option.values?.[0];
    if (option.id && firstValue?.name && (!option.input_type || option.input_type === "select")) {
      selection[option.id] = firstValue.name;
    }
  }

  return selection;
}

export function getDefaultPurchaseOption(product: Product): PurchaseOptionSelection {
  const plans = product.purchase_options?.subscription?.plans ?? [];
  if (!product.purchase_options?.standard && plans[0]?.id) {
    return { type: "subscription", plan_id: plans[0].id };
  }

  return { type: "standard" };
}

export interface ProductSelection {
  options: Record<string, string>;
  purchaseOption: PurchaseOptionSelection;
  quantity: number;
  variation: Product | null;
  setOption: (optionId: string, value: string | null) => void;
  setPurchaseOption: (selection: PurchaseOptionSelection) => void;
  setQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
}

export function useProductSelection(product: Product | null): ProductSelection {
  const [options, setOptions] = useState<Record<string, string>>({});
  const [purchaseOption, setPurchaseOption] = useState<PurchaseOptionSelection>({
    type: "standard",
  });
  const [quantity, setQuantityState] = useState(1);

  useEffect(() => {
    if (!product) return;
    setOptions(getDefaultOptions(product));
    setPurchaseOption(getDefaultPurchaseOption(product));
    setQuantityState(product.quantity_min ?? 1);
  }, [product?.id]);

  const variation = useMemo(() => {
    if (!product) return null;

    try {
      return swell.products.variation(product, options, purchaseOption) as Product;
    } catch {
      return product;
    }
  }, [options, product, purchaseOption]);

  const setOption = useCallback((optionId: string, value: string | null) => {
    setOptions((current) => {
      const next = { ...current };
      if (value === null) delete next[optionId];
      else next[optionId] = value;
      return next;
    });
  }, []);

  const minimum = product?.quantity_min ?? 1;
  const increment = product?.quantity_inc ?? 1;
  const setQuantity = useCallback(
    (next: number) => setQuantityState(Math.max(minimum, next)),
    [minimum],
  );

  return {
    options,
    purchaseOption,
    quantity,
    variation,
    setOption,
    setPurchaseOption,
    setQuantity,
    incrementQuantity: () => setQuantity(quantity + increment),
    decrementQuantity: () => setQuantity(quantity - increment),
  };
}
