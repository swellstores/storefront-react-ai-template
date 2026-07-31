import { useStorefront } from "../provider";
import type { ResolvedMenu, ResolvedMenuItem } from "./types";

export function useMenus(): Record<string, ResolvedMenu> {
  return useStorefront().menus;
}

export function useMenu(id?: string): ResolvedMenuItem[] {
  const menus = useMenus();
  const resolvedId = id || Object.keys(menus)[0];
  return resolvedId ? (menus[resolvedId]?.items ?? []) : [];
}
