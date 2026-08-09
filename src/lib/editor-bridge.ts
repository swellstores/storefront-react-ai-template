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
// Inline text editing: authored-copy elements that may become editable, and the
// catalog-bound slots that must NOT (product/cart text is hook-rendered — it has
// no source literal, so the server's exactly-one-match contract can't touch it;
// this selector is the visible affordance guard on top of that).
const TEXT_SELECTOR =
  "h1, h2, h3, h4, h5, h6, p, span, li, strong, em, small, blockquote, figcaption";
const PROTECTED_SLOT_SELECTOR = '[data-slot^="product"], [data-slot^="cart"]';
const EDIT_ORIGINAL_KEY = "swellEditOriginal";

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

  // ── Inline text editing ───────────────────────────────────────────────────
  // A selected section's authored-copy elements become editable on click:
  // contentEditable → Enter/blur commits, Escape cancels+restores. On commit we
  // keep the edited DOM optimistically and post edit-text to the parent, which
  // relays to the ai-api edit-text route and posts edit-text-reject on failure.
  let editingEl: HTMLElement | null = null;
  let textCursorEl: HTMLElement | null = null;
  let editSeq = 0;
  const pendingEdits = new Map<string, { el: HTMLElement; original: string }>();

  // The element to edit for a click/hover target: an authored-text element
  // inside the SELECTED section, not interactive, not catalog-bound, non-empty.
  const editableTextFrom = (node: EventTarget | null): HTMLElement | null => {
    if (!(node instanceof Element) || !selected) return null;
    const el = node.closest<HTMLElement>(TEXT_SELECTOR);
    if (!el || !selected.contains(el)) return null;
    if (el.closest(INTERACTIVE_SELECTOR)) return null;
    if (el.closest(PROTECTED_SLOT_SELECTOR)) return null;
    if (!(el.textContent || "").trim()) return null;
    return el;
  };

  const stopTextEdit = (save: boolean): void => {
    const el = editingEl;
    if (!el) return;
    editingEl = null;
    el.removeAttribute("contenteditable");
    el.style.cursor = "";
    const original = (el.dataset[EDIT_ORIGINAL_KEY] || "").trim();
    const next = (el.textContent || "").trim();
    delete el.dataset[EDIT_ORIGINAL_KEY];
    if (!save) {
      el.textContent = original;
      return;
    }
    if (!next || next === original) return; // no-op
    // Optimistic: keep the edited text; the parent posts edit-text-reject if the
    // server can't apply it (0 / 2+ source matches), and we restore then.
    const editId = `${Date.now()}_${editSeq++}`;
    pendingEdits.set(editId, { el, original });
    try {
      window.parent.postMessage(
        {
          __swellEditorChrome: true,
          action: "edit-text",
          editId,
          sectionId: selected?.getAttribute("data-section-id") ?? null,
          oldText: original,
          newText: next,
        },
        "*",
      );
    } catch {
      el.textContent = original;
      pendingEdits.delete(editId);
    }
  };

  const startTextEdit = (el: HTMLElement): void => {
    if (editingEl === el) return;
    if (editingEl) stopTextEdit(true);
    hovered = null;
    reposition();
    editingEl = el;
    el.dataset[EDIT_ORIGINAL_KEY] = el.textContent || "";
    el.setAttribute("contenteditable", "true");
    el.style.cursor = "text";
    el.focus();
    const sel = window.getSelection?.();
    if (sel) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    const cleanup = (): void => {
      el.removeEventListener("blur", onBlur);
      el.removeEventListener("keydown", onKey);
    };
    function onBlur(): void {
      cleanup();
      stopTextEdit(true);
    }
    function onKey(ev: KeyboardEvent): void {
      if (ev.key === "Escape") {
        ev.preventDefault();
        cleanup();
        stopTextEdit(false); // cancel + restore
        el.blur();
      } else if (ev.key === "Enter") {
        ev.preventDefault();
        el.blur(); // commit (single-line)
      }
    }
    el.addEventListener("blur", onBlur);
    el.addEventListener("keydown", onKey);
  };

  document.addEventListener("mouseover", (event) => {
    if (editingEl) return; // don't move overlays / cursors mid-edit
    const section = sectionFrom(event.target);
    if (section !== hovered) {
      hovered = section;
      reposition();
    }
    // Editable-text affordance: a text cursor on authored copy inside the
    // selected section. Catalog-bound text gets no cursor — visibly not editable.
    if (textCursorEl) {
      textCursorEl.style.cursor = "";
      textCursorEl = null;
    }
    const te = editableTextFrom(event.target);
    if (te) {
      te.style.cursor = "text";
      textCursorEl = te;
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
      // Mid-edit: clicks inside the editing element are caret placement — leave
      // them alone (clicking outside blurs → commits via the blur handler).
      if (editingEl && target instanceof Node && editingEl.contains(target))
        return;
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
      // Clicking authored text inside the ALREADY-selected section starts inline
      // editing rather than re-selecting (first click selects; second edits).
      if (section === selected) {
        const textEl = editableTextFrom(target);
        if (textEl) {
          event.preventDefault();
          startTextEdit(textEl);
        }
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
    const data = event.data as {
      __swellEditorChrome?: boolean;
      action?: string;
      editId?: string;
    } | null;
    if (!data || data.__swellEditorChrome !== true) return;
    if (data.action === "deselect-section") {
      selected = null;
      reposition();
    } else if (data.action === "edit-text-reject" && data.editId) {
      // Server couldn't apply the edit (0 / 2+ source matches) — restore the DOM
      // so the preview never shows an edit that didn't persist.
      const p = pendingEdits.get(data.editId);
      if (p) {
        p.el.textContent = p.original;
        pendingEdits.delete(data.editId);
      }
    } else if (data.action === "edit-text-ack" && data.editId) {
      pendingEdits.delete(data.editId);
    }
  });
}
