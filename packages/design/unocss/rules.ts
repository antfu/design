import type { DynamicShortcut, StaticShortcutMap } from '@unocss/core'

/**
 * Dynamic, name-driven design shortcuts.
 *
 * In UnoCSS terms these expand to *other utility classes*, so they are dynamic
 * shortcuts rather than raw-CSS rules — but they are the "dynamic rules" the
 * design system exposes: `badge-color-<name>` and `bg-glass(:<n>)`.
 */
export function buildRules(db: string): (StaticShortcutMap | DynamicShortcut)[] {
  return [
    // `badge-color-green`, `badge-color-blue`, … — a chip tinted by color name,
    // dark-aware. The deterministic formula shared across the source projects.
    [
      /^badge-color-(\w+)$/,
      ([, color]) => `bg-${color}-400/20 dark:bg-${color}-400/10 text-${color}-700 dark:text-${color}-300 border border-${color}-600/15 dark:border-${color}-300/15`,
      { layer: 'shortcuts' },
    ],
    // `bg-glass` / `bg-glass:75` — translucent surface + backdrop blur.
    [
      /^bg-glass(?::(\d+))?$/,
      ([, opacity = '50']) => `bg-white/${opacity} dark:bg-${db}/${opacity} backdrop-blur-7`,
      { layer: 'shortcuts' },
    ],
  ]
}
