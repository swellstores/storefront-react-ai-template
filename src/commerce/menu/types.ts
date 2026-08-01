export interface MenuItem {
  type: string;
  name: string;
  value?: string | { id?: string; slug?: string };
  url?: string;
  model?: string;
  items?: MenuItem[];
}

export interface Menu {
  id: string;
  name: string;
  items?: MenuItem[];
}

export interface ResolvedMenuItem {
  name: string;
  type: string;
  href: string;
  children: ResolvedMenuItem[];
  items: ResolvedMenuItem[];
}

export interface ResolvedMenu {
  id: string;
  name: string;
  items: ResolvedMenuItem[];
}
