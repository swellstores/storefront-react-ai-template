import type { Product, SubscriptionPlan } from "swell-js";

export type PurchaseOptionSelection =
  | { type: "standard" }
  | { type: "subscription"; plan_id: string };

export interface PurchaseOptionInfo {
  hasStandard: boolean;
  hasSubscription: boolean;
  hasBoth: boolean;
  plans: SubscriptionPlan[];
  standardPrice: number | null;
  standardSalePrice: number | null;
}

export interface ProductPurchaseOption {
  id: string;
  type: PurchaseOptionSelection["type"];
  label: string;
  price: number | null;
  selected: boolean;
  selection: PurchaseOptionSelection;
  billing: {
    interval: string;
    count: number;
  } | null;
}

export function getPurchaseOptionInfo(
  product: Product | null | undefined,
): PurchaseOptionInfo {
  const standard = product?.purchase_options?.standard;
  const plans = product?.purchase_options?.subscription?.plans ?? [];
  const hasStandard = Boolean(standard);
  const hasSubscription = plans.length > 0;

  return {
    hasStandard,
    hasSubscription,
    hasBoth: hasStandard && hasSubscription,
    plans,
    standardPrice: numberOrNull(standard?.price),
    standardSalePrice: standard?.sale ? numberOrNull(standard.sale_price) : null,
  };
}

export function getDefaultPurchaseOption(product: Product): PurchaseOptionSelection {
  const plans = product.purchase_options?.subscription?.plans ?? [];
  if (!product.purchase_options?.standard && plans[0]?.id) {
    return { type: "subscription", plan_id: plans[0].id };
  }

  return { type: "standard" };
}

export function getProductPurchaseOptions(
  product: Product | null | undefined,
  selected: PurchaseOptionSelection,
): ProductPurchaseOption[] {
  if (!product) return [];

  const info = getPurchaseOptionInfo(product);
  const options: ProductPurchaseOption[] = [];

  if (info.hasStandard) {
    options.push({
      id: "standard",
      type: "standard",
      label: "One-time purchase",
      price: info.standardSalePrice ?? info.standardPrice,
      selected: selected.type === "standard",
      selection: { type: "standard" },
      billing: null,
    });
  }

  for (const plan of info.plans) {
    if (!plan.id) continue;
    const interval = plan.billing_schedule?.interval;
    const count = plan.billing_schedule?.interval_count ?? 1;
    options.push({
      id: plan.id,
      type: "subscription",
      label: interval ? `Every ${count} ${interval}` : "Subscription",
      price: numberOrNull(plan.price),
      selected: selected.type === "subscription" && selected.plan_id === plan.id,
      selection: { type: "subscription", plan_id: plan.id },
      billing: interval ? { interval, count } : null,
    });
  }

  return options;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
