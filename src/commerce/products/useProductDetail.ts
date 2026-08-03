import { useEffect, useMemo, useState } from "react";
import type { Product, ProductOption } from "swell-js";

import { useCart } from "../cart";
import { useCurrency } from "../currency";
import {
  getProductImage,
  getProductImages,
  getProductPrice,
  type CommerceImage,
} from "../rendering";
import {
  getActiveOptions,
  useProductSelection,
  type ProductSelection,
} from "./selection";
import { getProductPurchaseOptions, type ProductPurchaseOption } from "./purchaseOptions";

export type ProductOptionControl =
  | {
      type: "select";
      id: string;
      name: string;
      value: string;
      values: Array<{ value: string; label: string; price: number | null }>;
      setValue: (value: string) => void;
    }
  | {
      type: "toggle";
      id: string;
      name: string;
      active: boolean;
      price: number | null;
      setActive: (active: boolean) => void;
    }
  | {
      type: "text";
      id: string;
      name: string;
      value: string;
      placeholder: string;
      multiline: boolean;
      setValue: (value: string) => void;
    };

export interface ProductGalleryState {
  images: CommerceImage[];
  activeIndex: number;
  activeImage: CommerceImage | null;
  setActiveIndex: (index: number) => void;
  next: () => void;
  previous: () => void;
}

export interface ProductQuantityState {
  value: number;
  min: number;
  increment: number;
  set: (quantity: number) => void;
  increase: () => void;
  decrease: () => void;
}

export function useProductDetail(product: Product | null | undefined) {
  const selection = useProductSelection(product ?? null);
  const { addProduct, addingProductId } = useCart();
  const { format } = useCurrency();
  const [activeIndex, setActiveIndexState] = useState(0);

  const selectedProduct = selection.variation ?? product ?? null;
  const images = useMemo(() => {
    const selectedImages = getProductImages(selectedProduct);
    if (selectedImages.length > 0) return selectedImages;

    const fallbackImage = getProductImage(product);
    return fallbackImage ? [fallbackImage] : [];
  }, [product, selectedProduct]);

  useEffect(() => {
    setActiveIndexState(0);
  }, [product?.id, images.length]);

  const setActiveIndex = (index: number) => {
    setActiveIndexState(Math.min(Math.max(index, 0), Math.max(images.length - 1, 0)));
  };

  const gallery: ProductGalleryState = {
    images,
    activeIndex,
    activeImage: images[activeIndex] ?? null,
    setActiveIndex,
    next: () => setActiveIndex(activeIndex + 1),
    previous: () => setActiveIndex(activeIndex - 1),
  };

  const price = getProductPrice(selectedProduct ?? product);
  const optionControls = product ? getProductOptionControls(product, selection) : [];
  const purchaseOptions = getProductPurchaseOptions(product, selection.purchaseOption);
  const min = product?.quantity_min ?? 1;
  const increment = product?.quantity_inc ?? 1;
  const quantity: ProductQuantityState = {
    value: selection.quantity,
    min,
    increment,
    set: selection.setQuantity,
    increase: selection.incrementQuantity,
    decrease: selection.decrementQuantity,
  };
  const stockStatus = selectedProduct?.stock_status ?? product?.stock_status ?? null;
  const inStock = stockStatus !== "out_of_stock" && stockStatus !== "discontinued";

  return {
    product: product ?? null,
    selectedProduct,
    gallery,
    price,
    formattedPrice: format(price.hasSale ? price.salePrice : price.price),
    formattedOriginalPrice: price.hasSale ? format(price.price) : null,
    optionControls,
    purchaseOptions,
    selection,
    quantity,
    stock: {
      status: stockStatus,
      inStock,
    },
    isAdding: Boolean(product?.id && addingProductId === product.id),
    addToCart: () => {
      if (!product) return Promise.resolve(null);
      return addProduct(product, {
        options: selection.options,
        purchaseOption: selection.purchaseOption,
        quantity: selection.quantity,
      });
    },
  };
}

function getProductOptionControls(
  product: Product,
  selection: ProductSelection,
): ProductOptionControl[] {
  return getActiveOptions(product)
    .filter((option) => option.id)
    .map((option) => toOptionControl(option, selection));
}

function toOptionControl(
  option: ProductOption,
  selection: ProductSelection,
): ProductOptionControl {
  const id = option.id!;
  const name = option.name ?? id;
  const inputType = String(option.input_type ?? "select");

  if (inputType === "toggle") {
    const value = option.values?.[0];
    return {
      type: "toggle",
      id,
      name,
      active: Boolean(selection.options[id]),
      price: numberOrNull(value?.price),
      setActive: (active) => selection.setOption(id, active ? value?.name ?? "true" : null),
    };
  }

  if (inputType === "text" || inputType === "textarea" || inputType === "short_text" || inputType === "long_text") {
    return {
      type: "text",
      id,
      name,
      value: selection.options[id] ?? "",
      placeholder: option.input_hint ?? "",
      multiline: inputType === "textarea" || inputType === "long_text",
      setValue: (value) => selection.setOption(id, value),
    };
  }

  return {
    type: "select",
    id,
    name,
    value: selection.options[id] ?? "",
    values: (option.values ?? [])
      .filter((value) => value.name)
      .map((value) => ({
        value: value.name!,
        label: value.name!,
        price: numberOrNull(value.price),
      })),
    setValue: (value) => selection.setOption(id, value),
  };
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
