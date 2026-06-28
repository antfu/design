import type { DynamicShortcut, StaticShortcutMap } from '@unocss/core'

/**
 * Build the semantic shortcut map. Written **base-agnostic** (uses only
 * `/opacity` modifiers + hex-with-alpha, never colon-opacity) so it resolves
 * identically under Wind4, Wind3 and Mini — the `shared-shortcuts.ts` from
 * `@vitejs/devtools-ui` is the proven template this generalizes.
 *
 * `db` is the configurable near-black for dark surfaces.
 */
export function buildShortcuts(db: string): (StaticShortcutMap | DynamicShortcut)[] {
  return [
    {
      // ── Text ──────────────────────────────────────────────────────────
      'color-base': 'color-neutral-800 dark:color-neutral-200',
      'color-muted': 'color-neutral-600 dark:color-neutral-400',
      'color-faint': 'color-neutral-500 dark:color-neutral-500',
      'color-active': 'color-primary-600 dark:color-primary-300',

      // ── Surfaces ──────────────────────────────────────────────────────
      'bg-base': `bg-white dark:bg-${db}`,
      'bg-secondary': 'bg-#f5f5f5 dark:bg-#1a1a1a',
      'bg-active': 'bg-#8881',
      'bg-hover': 'bg-primary/5',
      'bg-code': 'bg-gray-500/5',
      'bg-tooltip': `bg-white/75 dark:bg-${db}/75 backdrop-blur-8`,
      'bg-gradient-more': `bg-gradient-to-t from-white via-white/80 to-white/0 dark:from-${db} dark:via-${db}/80 dark:to-${db}/0`,

      // ── Borders / rings ───────────────────────────────────────────────
      'border-base': 'border-#8882',
      'border-mute': 'border-#8881',
      'border-active': 'border-primary-600/25 dark:border-primary-400/25',
      'ring-base': 'ring-#8882',

      // ── Opacity ───────────────────────────────────────────────────────
      'op-fade': 'op65 dark:op55',
      'op-mute': 'op30 dark:op25',

      // ── Buttons ───────────────────────────────────────────────────────
      'btn-action': 'border border-base rounded flex gap-2 items-center px2 py1 op75 hover:op100 hover:bg-active transition disabled:pointer-events-none disabled:op30! outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
      'btn-action-sm': 'btn-action text-sm',
      'btn-action-active': 'color-active border-active! bg-active op100!',
      'btn-icon': 'w-9 h-9 rounded-full op-fade hover:op100 hover:bg-active transition flex items-center justify-center disabled:pointer-events-none disabled:op30 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
      'btn-icon-compact': 'w-6 h-6 rounded op-fade hover:op100 hover:bg-active transition flex items-center justify-center disabled:pointer-events-none disabled:op30 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
      'btn-primary': 'px3 py1.5 rounded flex gap-2 items-center bg-primary-500 hover:bg-primary-600 text-white transition disabled:op50 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',

      // ── Badges ────────────────────────────────────────────────────────
      'badge': 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium leading-none',
      'badge-active': 'badge bg-active color-active',
      'badge-muted': 'badge bg-#8881 color-muted',

      // ── Type sizes (base-agnostic) ────────────────────────────────────
      'text-micro': 'text-[10px] leading-[1.4]',
      'text-mini': 'text-[11px] leading-[1.45]',
      'text-compact': 'text-[12px] leading-[1.5]',

      // NOTE: the preset deliberately ships **no** z-index scale. Stacking is a
      // whole-app concern, so the layer values are the app's to own — it defines
      // the named layers (`z-modal-content`, `z-dropdown`, …) that the overlay
      // components reference in its own top-level UnoCSS `shortcuts`. The preset
      // blocks plain `z-<number>` to keep usage semantic (see `./blocklist`).
    },
  ]
}
