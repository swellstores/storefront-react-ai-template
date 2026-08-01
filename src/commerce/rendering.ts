import type { Category, Product } from "swell-js";

type SwellImage = {
  alt?: string | null;
  caption?: string | null;
  url?: string | null;
  file?: {
    url?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

export interface CommerceImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductPrice {
  price: number | null;
  salePrice: number | null;
  currency: string | null;
  hasSale: boolean;
}

export function getProductImage(
  product: Product | null | undefined,
  index = 0,
): CommerceImage | null {
  const image = product?.images?.[index] as SwellImage | undefined;
  return imageDetails(image, product?.name);
}

export function getProductImageUrl(
  product: Product | null | undefined,
  index = 0,
): string | null {
  return getProductImage(product, index)?.url ?? null;
}

export function getCategoryImage(
  category: Category | null | undefined,
  index = 0,
): CommerceImage | null {
  const image = category?.images?.[index] as SwellImage | undefined;
  return imageDetails(image, category?.name);
}

export function getCategoryImageUrl(
  category: Category | null | undefined,
  index = 0,
): string | null {
  return getCategoryImage(category, index)?.url ?? null;
}

export function getProductPrice(
  product: Product | null | undefined,
): ProductPrice {
  const price = numberOrNull(product?.price);
  const salePrice = numberOrNull(product?.sale_price);

  return {
    price,
    salePrice,
    currency: typeof product?.currency === "string" ? product.currency : null,
    hasSale: salePrice !== null && price !== null && salePrice < price,
  };
}

function imageDetails(
  image: SwellImage | undefined,
  fallbackAlt: string | null | undefined,
): CommerceImage | null {
  const url = image?.file?.url ?? image?.url;
  if (!url) return null;

  return {
    url,
    alt: image?.alt || image?.caption || fallbackAlt || "",
    ...(typeof image.file?.width === "number" ? { width: image.file.width } : {}),
    ...(typeof image.file?.height === "number" ? { height: image.file.height } : {}),
  };
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
