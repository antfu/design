import type { DynamicShortcut, StaticShortcutMap } from '@unocss/core'
import type { PresetAnthonyDesignOptions } from './options'
import { DEFAULT_DARK_BG } from './options'

/**
 * Options for {@link buildShortcuts} — the subset of the preset's own options
 * this layer consumes. Typed off {@link PresetAnthonyDesignOptions} so the
 * names and semantics can't drift from the public surface, and so a new
 * knob is one key away instead of another positional argument.
 */
export type BuildShortcutsOptions = Pick<PresetAnthonyDesignOptions, 'darkBackground'>

/**
 * Build the semantic shortcut map. Written **base-agnostic** (uses only
 * `/opacity` modifiers + hex-with-alpha, never colon-opacity) so it resolves
 * identically under Wind4, Wind3 and Mini — the `shared-shortcuts.ts` from
 * `@vitejs/devtools-ui` is the proven template this generalizes.
 *
 * One exception: `icon-catppuccin` composes `filter`/`invert`/`hue-rotate`/
 * `brightness` utilities, which only Wind3/Wind4 ship (Mini has no filter
 * rules) — under Mini it's a harmless no-op rather than a hard error.
 *
 * @param options - See {@link BuildShortcutsOptions}; every field is optional
 * and falls back to the preset's own default.
 */
export function buildShortcuts(options: BuildShortcutsOptions = {}): (StaticShortcutMap | DynamicShortcut)[] {
  // Local alias — it appears inline in a dozen template strings below.
  const db = options.darkBackground ?? DEFAULT_DARK_BG

  return [
    {
      // ── Text ──────────────────────────────────────────────────────────
      'color-base': 'color-base-light dark:color-base-dark',
      'color-base-light': 'color-neutral-800',
      'color-base-dark': 'color-neutral-200',
      'color-muted': 'color-neutral-600 dark:color-neutral-400',
      'color-faint': 'color-neutral-500 dark:color-neutral-500',
      'color-active': 'color-primary-600 dark:color-primary-300',

      // ── Surfaces ──────────────────────────────────────────────────────
      // `bg-base`/`bg-secondary` are *opaque* — the right choice for anything
      // that has to occlude what's behind it (portaled popovers, modals,
      // drawers, sticky headers), and wrong for anything merely nested inside
      // a panel: they punch a solid rectangle through a translucent
      // (`bg-glass`) or otherwise-colored parent, so a card-on-panel and an
      // input-on-card collapse into one flat tone.
      'bg-base': `bg-white dark:bg-${db}`,
      'bg-secondary': 'bg-#f6f6f6 dark:bg-#101010',
      // …so nested *in-flow* layers use the panel-relative pair instead:
      // alpha-only, hue-neutral, and therefore composited over whatever is
      // actually behind them. `bg-raised` lifts a layer toward the light
      // (cards, input fills, the active tab pill), `bg-sunken` pushes it away
      // (segment tracks, wells, keycaps). Stacking them nests visibly, which
      // the opaque pair cannot do.
      'bg-raised': 'bg-white/65 dark:bg-white/6',
      'bg-sunken': 'bg-black/4 dark:bg-black/20',
      // `bg-active` is a *persisted* state (selected/checked/open/current);
      // `bg-hover` is *transient* pointer/keyboard feedback (`:hover`,
      // `data-[highlighted]`) — lighter, so the two never read the same.
      'bg-active': 'bg-#99999930',
      'bg-ambient': 'bg-#99999925',
      'bg-hover': 'bg-#99999920',
      'bg-code': 'bg-gray-500/5',
      'bg-tooltip': `bg-white/75 dark:bg-${db}/75 backdrop-blur-8`,
      'bg-gradient-more': `bg-gradient-to-t from-white via-white/80 to-white/0 dark:from-${db} dark:via-${db}/80 dark:to-${db}/0`,

      // ── Borders / rings ───────────────────────────────────────────────
      'border-base': 'border-#9992',
      'border-mute': 'border-#9991',
      'border-active': 'border-primary-600/25 dark:border-primary-400/25',
      'ring-base': 'ring-#9992',

      // ── Opacity ───────────────────────────────────────────────────────
      'op-fade': 'op65 dark:op55',
      'op-mute': 'op30 dark:op25',

      // ── Icons ─────────────────────────────────────────────────────────
      // Catppuccin-style file/folder icon sets are tuned for a dark surface.
      // On a light one they read washed-out, so invert + rehue + dim the
      // filter chain there and cancel it back to native color under `dark:`
      // (this preset's dark mode is `.dark`-class driven, never a `.light`
      // counterpart — see `DisplayFileIcon`, which bakes this in by default).
      'icon-catppuccin': 'invert-100 hue-rotate-180 brightness-80 dark:invert-0 dark:hue-rotate-0 dark:brightness-100',

      // ── Buttons ───────────────────────────────────────────────────────
      // `btn-action`, `btn-primary` and `btn-text` are **peers at one size**:
      // same padding (`px2 py1`), same 1px border box (transparent where the
      // variant shows no border), same gap and focus ring. That's what lets a
      // mixed `[primary][secondary][ghost]` row line up — a variant carrying
      // its own padding, or no border at all, is 2–8px off its neighbours.
      // Append `text-sm` (or use `btn-action-sm`) for the compact size.
      'btn-action': 'border border-base rounded flex gap-2 items-center px2 py1 op75 hover:op100 hover:bg-hover transition disabled:pointer-events-none disabled:op30! outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
      'btn-action-sm': 'btn-action text-sm',
      'btn-action-active': 'color-active border-active! bg-active op100!',
      'btn-icon': 'w-9 h-9 rounded-full op-fade hover:op100 hover:bg-hover transition flex items-center justify-center disabled:pointer-events-none disabled:op30 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
      'btn-icon-compact': 'w-6 h-6 rounded op-fade hover:op100 hover:bg-hover transition flex items-center justify-center disabled:pointer-events-none disabled:op30 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
      // Bordered, square counterpart to the round/borderless `btn-icon` — for
      // toolbar-style icon buttons that read as a distinct affordance.
      'btn-icon-square': 'w-9 h-9 rounded border border-base op-fade hover:op100 hover:bg-hover transition flex items-center justify-center disabled:pointer-events-none disabled:op30 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
      // The transparent border is load-bearing: it matches `btn-action`'s
      // border box so the two are the same height side by side.
      'btn-primary': 'px2 py1 rounded border border-transparent flex gap-2 items-center bg-primary-500 hover:bg-primary-600 text-white transition disabled:op50 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
      // Chromeless ("ghost") peer: no border or fill until hovered, but the
      // same box as the other two — so it keeps a real hit area, and reacts to
      // `:disabled` and `:focus-visible` like a button rather than like text.
      'btn-text': 'px2 py1 rounded border border-transparent inline-flex gap-2 items-center op75 hover:op100 hover:bg-hover transition disabled:pointer-events-none disabled:op30! outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',

      // ── Badges ────────────────────────────────────────────────────────
      'badge': 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium leading-none',
      'badge-active': 'badge bg-active color-active',
      'badge-muted': 'badge bg-#8881 color-muted',

      // ── Type sizes (base-agnostic) ────────────────────────────────────
      'text-micro': 'text-[10px] leading-[1.4]',
      'text-mini': 'text-[11px] leading-[1.45]',
      'text-compact': 'text-[12px] leading-[1.5]',

      // ── Safe-area padding (notches / home indicators) ─────────────────
      'pad-safe-t': 'pt-[env(safe-area-inset-top)]',
      'pad-safe-r': 'pr-[env(safe-area-inset-right)]',
      'pad-safe-b': 'pb-[env(safe-area-inset-bottom)]',
      'pad-safe-l': 'pl-[env(safe-area-inset-left)]',
      'pad-safe-x': 'pad-safe-l pad-safe-r',
      'pad-safe-y': 'pad-safe-t pad-safe-b',
      'pad-safe': 'pad-safe-x pad-safe-y',

      // NOTE: the preset deliberately ships **no** z-index scale. Stacking is a
      // whole-app concern, so the layer values are the app's to own — it defines
      // the named layers (`z-modal-content`, `z-dropdown`, …) that the overlay
      // components reference in its own top-level UnoCSS `shortcuts`. The preset
      // blocks plain `z-<number>` to keep usage semantic (see `./blocklist`).
    },
  ]
}
