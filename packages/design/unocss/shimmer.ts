import type { Preflight, Rule } from '@unocss/core'
import { parseColor } from '@unocss/preset-mini/utils'

/**
 * `shimmer` — a text shimmer that sweeps over `currentColor`.
 *
 * Ported from shadcn/ui's `shimmer` utility (MIT, by @shadcn / Vercel):
 * https://ui.shadcn.com/docs/utils/shimmer — re-expressed as native UnoCSS. The
 * base `shimmer` rule ships its own `@keyframes` plus dark/RTL/reduced-motion
 * blocks, so they appear only when used (wind4's `animate-*` trick); the bare
 * `@property` registrations sit in a preflight. The rest are dynamic modifiers.
 *
 * - `shimmer-once` / `shimmer-reverse` / `shimmer-none`
 * - `shimmer-color-<color>` / `-[<value>]` (theme tokens + `/<pct>` opacity)
 * - `shimmer-duration-<n>` (ms), `shimmer-spread-<n>`/`-[<value>]`, `shimmer-angle-<n>` (deg)
 */
const GRAD = `linear-gradient(calc(90deg + var(--shimmer-angle)),var(--_base) calc(50% - var(--_spread)),color-mix(in oklch,var(--_highlight),var(--_base) 50%) calc(50% - var(--_spread) * 0.5),var(--_highlight) 50%,color-mix(in oklch,var(--_highlight),var(--_base) 50%) calc(50% + var(--_spread) * 0.5),var(--_base) calc(50% + var(--_spread)))`

export const shimmerRules: Rule[] = [
  ['shimmer', [
    {
      '--_spread': 'var(--shimmer-spread, calc(3ch + 40px))',
      '--_base': 'currentColor',
      '--_highlight': 'var(--shimmer-color, oklch(from currentColor l c h / calc(alpha * 0.2)))',
      'background-image': `var(--shimmer-image, ${GRAD})`,
      'background-repeat': 'no-repeat',
      'background-size': 'calc(200% + var(--_spread) * 2) 100%',
      'background-position': '0 0',
      'background-clip': 'text',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'var(--shimmer-text-fill, transparent)',
      'animation': 'tw-shimmer var(--shimmer-duration, 2s) linear infinite',
    },
    `@keyframes tw-shimmer{from{background-position:100% 0}to{background-position:0 0}}`,
    `:where(html.dark) .shimmer{--_highlight:var(--shimmer-color,oklch(from currentColor max(0.8,calc(l + 0.4)) c h / calc(alpha + 0.4)))}`,
    `.shimmer:where([dir="rtl"],[dir="rtl"] *){animation-direction:reverse}`,
    `@media (prefers-reduced-motion:reduce){.shimmer{animation:none;background-image:none;-webkit-text-fill-color:currentColor}}`,
  ]],
  ['shimmer-once', { 'animation-iteration-count': '1' }],
  ['shimmer-reverse', { 'animation-direction': 'reverse' }],
  ['shimmer-none', { '--shimmer-image': 'none', '--shimmer-text-fill': 'currentColor' }],
  [/^shimmer-duration-(\d+)$/, ([, n]) => ({ '--shimmer-duration': `calc(${n} * 1ms)` })],
  [/^shimmer-angle-(\d+)$/, ([, n]) => ({ '--shimmer-angle': `calc(${n} * 1deg)` })],
  [/^shimmer-spread-\[(.+)\]$/, ([, v]) => ({ '--shimmer-spread': v })],
  [/^shimmer-spread-(\d+)$/, ([, n]) => ({ '--shimmer-spread': `calc(var(--spacing) * ${n})` })],
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
  ],
]

/** Registered so `--shimmer-angle` animates and the toggles type-check; foundational. */
export const shimmerPreflight: Preflight = {
  layer: 'default',
  getCSS: () => `@property --shimmer-angle{syntax:"<angle>";inherits:true;initial-value:20deg}@property --shimmer-image{syntax:"*";inherits:false}@property --shimmer-text-fill{syntax:"*";inherits:false}`,
}
