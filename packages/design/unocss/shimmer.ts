import type { Rule } from '@unocss/core'
import { parseColor } from '@unocss/preset-mini/utils'

/**
 * Modifiers for the `shimmer` text effect. The base `shimmer` class plus its
 * `@property`/`@keyframes`, dark brightening and reduced-motion fallback ship in
 * `styles/shimmer.css`; these rules tune the sweep and toggle it.
 *
 * Ported from shadcn/ui's `shimmer` utility (MIT, by @shadcn / Vercel):
 * https://ui.shadcn.com/docs/utils/shimmer
 *
 * - `shimmer-once` / `shimmer-reverse` / `shimmer-none`
 * - `shimmer-color-<color>` / `-[<value>]` (theme colors + `/<pct>` opacity)
 * - `shimmer-duration-<n>` (ms), `shimmer-spread-<n>`/`-[<value>]`, `shimmer-angle-<n>` (deg)
 */
export const shimmerRules: Rule[] = [
  ['shimmer-once', { 'animation-iteration-count': '1' }, { layer: 'default' }],
  ['shimmer-reverse', { 'animation-direction': 'reverse' }, { layer: 'default' }],
  ['shimmer-none', { '--shimmer-image': 'none', '--shimmer-text-fill': 'currentColor' }, { layer: 'default' }],

  ['shimmer-duration-DEFAULT', { '--shimmer-duration': '2000ms' }, { layer: 'default' }],
  [/^shimmer-duration-(\d+)$/, ([, n]) => ({ '--shimmer-duration': `calc(${n} * 1ms)` }), { layer: 'default' }],
  [/^shimmer-angle-(\d+)$/, ([, n]) => ({ '--shimmer-angle': `calc(${n} * 1deg)` }), { layer: 'default' }],
  [/^shimmer-spread-\[(.+)\]$/, ([, v]) => ({ '--shimmer-spread': v }), { layer: 'default' }],
  [/^shimmer-spread-(\d+)$/, ([, n]) => ({ '--shimmer-spread': `calc(var(--spacing) * ${n})` }), { layer: 'default' }],

  // Color: theme tokens (`blue-500`, with optional `/<pct>`) or arbitrary values.
  [
    /^shimmer-color-(.+)$/,
    ([, body], { theme }) => {
      if (!body)
        return
      const parsed = parseColor(body, theme)
      if (!parsed?.color)
        return
      return parsed.alpha != null
        ? { '--shimmer-color': `color-mix(in oklch, ${parsed.color} ${Number(parsed.alpha) * 100}%, transparent)` }
        : { '--shimmer-color': parsed.color }
    },
    { layer: 'default' },
  ],
]
