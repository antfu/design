import type { CSSObject, Preflight, Rule } from '@unocss/core'

/**
 * `scroll-fade` — a scroll-aware fade on the edges of a scroll container.
 *
 * Ported from shadcn/ui's `scroll-fade` utility (MIT, by @shadcn / Vercel):
 * https://ui.shadcn.com/docs/utils/scroll-fade — re-expressed as native UnoCSS.
 * Each utility is a rule that returns its declarations plus the `@supports`/
 * `@keyframes` it needs as raw blocks, so those at-rules ship only when the
 * class is used (the trick wind4's `animate-*` uses for keyframes). Only the
 * `@property` registrations sit in a preflight — foundational, like a reset.
 *
 * - `scroll-fade` / `scroll-fade-y` / `scroll-fade-x` — vertical / horizontal
 * - `scroll-fade-{t,b,l,r,s,e}` — single edge (logical `s`/`e` mirror in RTL)
 * - `scroll-fade-<n>` / `-[<value>]`, `scroll-fade-{t,b,s,e}-<n>` — fade depth
 * - `scroll-fade-none` — disable (variant-friendly, e.g. `md:scroll-fade-none`)
 */

type Edge = 't' | 'b' | 's' | 'e'
const SIZE = 'min(12%, calc(var(--spacing) * 10))'
const REVEAL = 'var(--scroll-fade-reveal, calc(var(--spacing) * 24))'
const REPEAT: CSSObject = { '-webkit-mask-repeat': 'no-repeat', 'mask-repeat': 'no-repeat' }
const size = (e: Edge): string => `var(--scroll-fade-${e}-size,var(--scroll-fade-size,${SIZE}))`
const KF: Record<Edge, string> = {
  t: `@keyframes scroll-fade-reveal-t{from{--scroll-fade-t:0px}to{--scroll-fade-t:${size('t')}}}`,
  b: `@keyframes scroll-fade-reveal-b{from{--scroll-fade-b:${size('b')}}to{--scroll-fade-b:0px}}`,
  s: `@keyframes scroll-fade-reveal-s{from{--scroll-fade-s:0px}to{--scroll-fade-s:${size('s')}}}`,
  e: `@keyframes scroll-fade-reveal-e{from{--scroll-fade-e:${size('e')}}to{--scroll-fade-e:0px}}`,
}

/** Both-edge fade on one axis; degrades to a static fade where unsupported. */
function axis(sel: string, mask: string, [a, b]: [Edge, Edge], tl: string, rtl?: string): Rule {
  return [sel, [
    { '-webkit-mask-image': mask, 'mask-image': mask, '-webkit-mask-composite': 'source-in', 'mask-composite': 'intersect', ...REPEAT },
    rtl && `.${sel}:where([dir="rtl"],[dir="rtl"] *){-webkit-mask-image:${rtl};mask-image:${rtl}}`,
    `@supports (animation-timeline:scroll()){.${sel}{animation:scroll-fade-reveal-${a} 1ms ease-in-out,scroll-fade-reveal-${b} 1ms ease-in-out;animation-timeline:scroll(self ${tl}),scroll(self ${tl});animation-range:0 ${REVEAL},calc(100% - ${REVEAL}) 100%;animation-fill-mode:both}}`,
    `@supports not (animation-timeline:scroll()){.${sel}{--scroll-fade-${a}:${size(a)};--scroll-fade-${b}:${size(b)}}}`,
    KF[a],
    KF[b],
  ].filter(Boolean) as string[]]
}

/** Single-edge fade that tracks one end of the scroll. */
function edge(sel: string, e: Edge, mask: string, tl: string, range: string, rtl?: string): Rule {
  return [sel, [
    { '--scroll-fade-mask': mask, '-webkit-mask-image': 'var(--scroll-fade-mask)', 'mask-image': 'var(--scroll-fade-mask)', ...REPEAT },
    rtl && `.${sel}:where([dir="rtl"],[dir="rtl"] *){--scroll-fade-mask:${rtl}}`,
    `@supports (animation-timeline:scroll()){.${sel}{animation:scroll-fade-reveal-${e} 1ms ease-in-out;animation-timeline:scroll(self ${tl});animation-range:${range};animation-fill-mode:both}}`,
    `@supports not (animation-timeline:scroll()){.${sel}{--scroll-fade-${e}:${size(e)}}}`,
    KF[e],
  ].filter(Boolean) as string[]]
}

const block = `linear-gradient(to bottom,transparent 0,#000 var(--scroll-fade-t,0px),#000 calc(100% - var(--scroll-fade-b,0px)),transparent 100%)`
const inL = `linear-gradient(to right,transparent 0,#000 var(--scroll-fade-s,0px),#000 calc(100% - var(--scroll-fade-e,0px)),transparent 100%)`

export const scrollFadeRules: Rule[] = [
  axis('scroll-fade', block, ['t', 'b'], 'y'),
  axis('scroll-fade-y', block, ['t', 'b'], 'y'),
  axis('scroll-fade-x', inL, ['s', 'e'], 'inline', inL.replace('to right', 'to left')),
  edge('scroll-fade-t', 't', `linear-gradient(to bottom,transparent 0,#000 var(--scroll-fade-t,0px),#000 100%)`, 'y', `0 ${REVEAL}`),
  edge('scroll-fade-b', 'b', `linear-gradient(to bottom,#000 0,#000 calc(100% - var(--scroll-fade-b,0px)),transparent 100%)`, 'y', `calc(100% - ${REVEAL}) 100%`),
  edge('scroll-fade-l', 's', `linear-gradient(to right,transparent 0,#000 var(--scroll-fade-s,0px),#000 100%)`, 'x', `0 ${REVEAL}`),
  edge('scroll-fade-r', 'e', `linear-gradient(to right,#000 0,#000 calc(100% - var(--scroll-fade-e,0px)),transparent 100%)`, 'x', `calc(100% - ${REVEAL}) 100%`),
  edge('scroll-fade-s', 's', `linear-gradient(to right,transparent 0,#000 var(--scroll-fade-s,0px),#000 100%)`, 'inline', `0 ${REVEAL}`, `linear-gradient(to left,transparent 0,#000 var(--scroll-fade-s,0px),#000 100%)`),
  edge('scroll-fade-e', 'e', `linear-gradient(to right,#000 0,#000 calc(100% - var(--scroll-fade-e,0px)),transparent 100%)`, 'inline', `calc(100% - ${REVEAL}) 100%`, `linear-gradient(to left,#000 0,#000 calc(100% - var(--scroll-fade-e,0px)),transparent 100%)`),
  ['scroll-fade-none', { '--scroll-fade-mask': 'none' }],
  [/^scroll-fade-([tbse])-\[(.+)\]$/, ([, e, v]) => ({ [`--scroll-fade-${e}-size`]: v })],
  [/^scroll-fade-([tbse])-(\d+)$/, ([, e, n]) => ({ [`--scroll-fade-${e}-size`]: `calc(var(--spacing) * ${n})` })],
  [/^scroll-fade-\[(.+)\]$/, ([, v]) => ({ '--scroll-fade-size': v })],
  [/^scroll-fade-(\d+)$/, ([, n]) => ({ '--scroll-fade-size': `calc(var(--spacing) * ${n})` })],
  // Companion: hide the scrollbar so a faded scroller shows no stray edge bar.
  ['no-scrollbar', [{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }, `.no-scrollbar::-webkit-scrollbar{display:none}`]],
]

/** `--scroll-fade-*` registered so they interpolate; foundational, hence a preflight. */
export const scrollFadePreflight: Preflight = {
  layer: 'default',
  getCSS: () => `@property --scroll-fade-t{syntax:"<length-percentage>";inherits:false;initial-value:0px}@property --scroll-fade-b{syntax:"<length-percentage>";inherits:false;initial-value:0px}@property --scroll-fade-s{syntax:"<length-percentage>";inherits:false;initial-value:0px}@property --scroll-fade-e{syntax:"<length-percentage>";inherits:false;initial-value:0px}@property --scroll-fade-mask{syntax:"*";inherits:false}`,
}
