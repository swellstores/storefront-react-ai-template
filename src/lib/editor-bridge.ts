/**
 * Editor bridge — active ONLY when the storefront is framed inside the admin
 * editor (`?swellEmbedded=1`). It lets the editor select sections:
 *
 *   click a section's non-interactive area
 *     → draw a selection outline (tracks the section through scroll/resize)
 *     → postMessage({ __swellEditorChrome: true, action: 'select-section',
 *                     sectionId }, '*') to the parent editor
 *
 * The message shape is the contract the admin editor already listens for.
 * Clicks on interactive elements (links, buttons, inputs, …) are left alone so
 * the preview stays usable.
 *
 * Minimal + additive: this is the template-side half of the section-targeting
 * layer (see Vlad finding #7). A fuller design — hover states, multi-select,
 * add-at-position, keyboard nav — lands with that proposal.
 */

const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, summary, [role="button"], [role="link"], [contenteditable="true"]';

const SECTION_SELECTOR = "[data-section-id]";

export function installEditorBridge(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!new URLSearchParams(window.location.search).has("swellEmbedded")) return;
  const w = window as unknown as { __swellEditorBridgeInstalled?: boolean };
  if (w.__swellEditorBridgeInstalled) return;
  w.__swellEditorBridgeInstalled = true;

  const outline = document.createElement("div");
  outline.setAttribute("data-swell-editor-outline", "");
  Object.assign(outline.style, {
    position: "fixed",
    pointerEvents: "none",
    zIndex: "2147483647",
    border: "2px solid #635bff",
    borderRadius: "6px",
    boxShadow: "0 0 0 1px rgba(99, 91, 255, 0.25)",
    display: "none",
    top: "0",
    left: "0",
    width: "0",
    height: "0",
  } as Partial<CSSStyleDeclaration>);
  document.body.appendChild(outline);

  let selected: HTMLElement | null = null;

  const reposition = (): void => {
    if (!selected || !selected.isConnected) {
      outline.style.display = "none";
      return;
    }
    const r = selected.getBoundingClientRect();
    outline.style.display = "block";
    outline.style.top = `${r.top}px`;
    outline.style.left = `${r.left}px`;
    outline.style.width = `${r.width}px`;
    outline.style.height = `${r.height}px`;
  };

  const post = (sectionId: string | null): void => {
    try {
      window.parent.postMessage(
        { __swellEditorChrome: true, action: "select-section", sectionId },
        "*",
      );
    } catch {
      /* cross-origin parent may reject; selection is best-effort */
    }
  };

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      // Never hijack interactive elements — links/buttons/inputs must work.
      if (target.closest(INTERACTIVE_SELECTOR)) return;
      const section = target.closest<HTMLElement>(SECTION_SELECTOR);
      if (!section) {
        selected = null;
        reposition();
        post(null);
        return;
      }
      event.preventDefault();
      selected = section;
      reposition();
      post(section.getAttribute("data-section-id"));
    },
    true,
  );

  // Keep the outline glued to the section through iframe scroll + viewport
  // resizes (getBoundingClientRect is viewport-relative, so a fixed box tracks
  // it correctly). Capture-phase scroll catches scrolling on any container.
  window.addEventListener("scroll", reposition, true);
  window.addEventListener("resize", reposition);
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(reposition).observe(document.documentElement);
  }

  // Let the editor clear/refresh selection.
  window.addEventListener("message", (event) => {
    const data = event.data as { __swellEditorChrome?: boolean; action?: string } | null;
    if (!data || data.__swellEditorChrome !== true) return;
    if (data.action === "deselect-section") {
      selected = null;
      reposition();
    }
  });
}
