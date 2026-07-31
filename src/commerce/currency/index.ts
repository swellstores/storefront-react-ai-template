import { useMemo } from "react";

import { useStorefront } from "../provider";

export function formatCurrency(amount: number, currency: string, locale?: string): string {
  try {
    return new Intl.NumberFormat(locale || undefined, {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  } catch {
    return `${currency || "USD"} ${amount.toFixed(2)}`;
  }
}

export function useCurrency() {
  const { currency, currencies, locale, setCurrency } = useStorefront();
  const active = currencies.find((item) => item.code === currency) ?? null;

  return {
    active,
    code: currency,
    available: currencies,
    setCurrency,
    format: useMemo(
      () => (amount: number) => formatCurrency(amount, currency, locale),
      [currency, locale],
    ),
  };
}
