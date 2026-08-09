/**
 * Editor bridge — active ONLY when the storefront is framed inside the admin
 * editor (`?swellEmbedded=1`). It gives the editor a full section-selection
 * interaction model:
 *
 *   hover a section's non-interactive area
 *     → softened-blurple boundary + a section-tag pill in the top-left corner
 *       (the affordance; hover ≠ selected)
 *   click a section's non-interactive area (anywhere in the outlined region)
 *     → persistent boundary + tag + postMessage select-section to the parent,
 *       which opens the RegenPopup (existing editor.js contract)
 *
 * Clicks on interactive elements (links, buttons, inputs, …) are left alone.
 * The blurple + softened (68% via color-mix) recipe mirrors the chrome
 * selection/tag treatment already in the admin.
 *
 * Minimal + additive: the template-side half of the section-targeting layer
 * (Vlad finding #7). A fuller design (multi-select, add-at-position, keyboard)
 * lands with that proposal.
 */

const BLURPLE = "#635bff";
const HOVER_BORDER = `color-mix(in srgb, ${BLURPLE} 68%, transparent)`;
const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, summary, [role="button"], [role="link"], [contenteditable="true"]';
const SECTION_SELECTOR = "[data-section-id]";

export function installEditorBridge(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!new URLSearchParams(window.location.search).has("swellEmbedded")) return;
  const w = window as unknown as { __swellEditorBridgeInstalled?: boolean };
  if (w.__swellEditorBridgeInstalled) return;
  w.__swellEditorBridgeInstalled = true;

  const makeBox = (border: string, z: number, marker: string): HTMLDivElement => {
    const el = document.createElement("div");
    el.setAttribute("data-swell-editor-overlay", marker);
    Object.assign(el.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: String(z),
      border: `2px solid ${border}`,
      borderRadius: "6px",
      boxSizing: "border-box",
      display: "none",
      top: "0",
      left: "0",
      width: "0",
      height: "0",
    } as Partial<CSSStyleDeclaration>);
    document.body.appendChild(el);
    return el;
  };
  const makeTag = (z: number, marker: string): HTMLDivElement => {
    const el = document.createElement("div");
    el.setAttribute("data-swell-editor-overlay", marker);
    Object.assign(el.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: String(z),
      background: BLURPLE,
      color: "#ffffff",
      font: '500 11px/1.3 ui-sans-serif, system-ui, sans-serif',
      letterSpacing: "0.02em",
      padding: "2px 6px",
      borderRadius: "5px",
      display: "none",
      whiteSpace: "nowrap",
      top: "0",
      left: "0",
    } as Partial<CSSStyleDeclaration>);
    document.body.appendChild(el);
    return el;
  };

  const hoverBox = makeBox(HOVER_BORDER, 2147483645, "hover-box");
  const hoverTag = makeTag(2147483646, "hover-tag");
  const selBox = makeBox(BLURPLE, 2147483646, "sel-box");
  const selTag = makeTag(2147483647, "sel-tag");

  let hovered: HTMLElement | null = null;
  let selected: HTMLElement | null = null;

  const labelOf = (s: HTMLElement): string =>
    s.getAttribute("data-section-role") ||
    s.getAttribute("data-section-type") ||
    s.getAttribute("data-section-id") ||
    "section";

  const place = (
    box: HTMLDivElement,
    tag: HTMLDivElement,
    section: HTMLElement | null,
  ): void => {
    if (!section || !section.isConnected) {
      box.style.display = "none";
      tag.style.display = "none";
      return;
    }
    const r = section.getBoundingClientRect();
    box.style.display = "block";
    box.style.top = `${r.top}px`;
    box.style.left = `${r.left}px`;
    box.style.width = `${r.width}px`;
    box.style.height = `${r.height}px`;
    // Tag pill: top-left corner, detached 4px in.
    tag.textContent = labelOf(section);
    tag.style.display = "block";
    tag.style.top = `${r.top + 4}px`;
    tag.style.left = `${r.left + 4}px`;
  };

  const reposition = (): void => {
    place(selBox, selTag, selected);
    // Don't double-draw hover over the selected section.
    if (hovered && hovered !== selected) {
      place(hoverBox, hoverTag, hovered);
    } else {
      hoverBox.style.display = "none";
      hoverTag.style.display = "none";
    }
  };

  const post = (sectionId: string | null): void => {
    try {
      window.parent.postMessage(
        { __swellEditorChrome: true, action: "select-section", sectionId },
        "*",
      );
    } catch {
      /* cross-origin parent may reject; best-effort */
    }
  };

  const sectionFrom = (node: EventTarget | null): HTMLElement | null =>
    node instanceof Element
      ? (node.closest<HTMLElement>(SECTION_SELECTOR) ?? null)
      : null;

  document.addEventListener("mouseover", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) {
      // Still track the section, but the affordance is the boundary, not the control.
    }
    const section = sectionFrom(event.target);
    if (section !== hovered) {
      hovered = section;
      reposition();
    }
  });

  document.addEventListener("mouseout", (event) => {
    const to = (event as MouseEvent).relatedTarget;
    if (!sectionFrom(to)) {
      hovered = null;
      reposition();
    }
  });

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      // Interactive controls behave normally — never hijack them.
      if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR))
        return;
      const section = sectionFrom(target);
      if (!section) {
        selected = null;
        reposition();
        post(null);
        return;
      }
      // The whole outlined region (section bounds) is the click target.
      event.preventDefault();
      selected = section;
      hovered = section;
      reposition();
      post(section.getAttribute("data-section-id"));
    },
    true,
  );

  // Keep both overlays glued to their sections through iframe scroll + resize.
  window.addEventListener("scroll", reposition, true);
  window.addEventListener("resize", reposition);
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(reposition).observe(document.documentElement);
  }

  window.addEventListener("message", (event) => {
    const data = event.data as { __swellEditorChrome?: boolean; action?: string } | null;
    if (!data || data.__swellEditorChrome !== true) return;
    if (data.action === "deselect-section") {
      selected = null;
      reposition();
    }
  });
}
