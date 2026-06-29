import type { Rule } from '@unocss/core'

/**
 * Dynamic size + disable modifiers for the `scroll-fade` utilities. The base
 * classes (`scroll-fade`, `scroll-fade-x`, the edges, …) plus their
 * `@property`/`@keyframes` ship in `styles/scroll-fade.css`; these rules only
 * tweak the fade depth and let `scroll-fade-none` participate in variants
 * (`md:scroll-fade-none`).
 *
 * Ported from shadcn/ui's `scroll-fade` utility (MIT, by @shadcn / Vercel):
 * https://ui.shadcn.com/docs/utils/scroll-fade
 *
 * - `scroll-fade-<n>` / `scroll-fade-[<value>]` — both edges (spacing scale / raw)
 * - `scroll-fade-{t,b,s,e}-<n>` / `-[<value>]` — one edge, overrides the above
 * - `scroll-fade-none` — `--scroll-fade-mask: none`
 */
export const scrollFadeRules: Rule[] = [
  // Disable — class-order independent, so it composes with variants.
  ['scroll-fade-none', { '--scroll-fade-mask': 'none' }, { layer: 'default' }],

  // Per-edge sizes (must precede the both-edges rule so `t/b/s/e` aren't eaten).
  [
    /^scroll-fade-([tbse])-\[(.+)\]$/,
    ([, edge, value]) => ({ [`--scroll-fade-${edge}-size`]: value }),
    { layer: 'default' },
  ],
  [
    /^scroll-fade-([tbse])-(\d+)$/,
    ([, edge, n]) => ({ [`--scroll-fade-${edge}-size`]: `calc(var(--spacing) * ${n})` }),
    { layer: 'default' },
  ],

  // Both edges.
  [/^scroll-fade-\[(.+)\]$/, ([, value]) => ({ '--scroll-fade-size': value }), { layer: 'default' }],
  [/^scroll-fade-(\d+)$/, ([, n]) => ({ '--scroll-fade-size': `calc(var(--spacing) * ${n})` }), { layer: 'default' }],
]
