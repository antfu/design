import type { Preflight, Rule } from '@unocss/core'

/**
 * `scroll-fade` — a scroll-aware fade on the edges of a scroll container.
 *
 * Ported from shadcn/ui's `scroll-fade` utility (MIT, by @shadcn / Vercel):
 * https://ui.shadcn.com/docs/utils/scroll-fade — re-expressed for UnoCSS. The
 * `@property`/`@keyframes` + the base/edge classes ride in a preflight (they
 * need at-rules the rule engine can't nest); depth + `-none` are dynamic rules.
 *
 * - `scroll-fade` / `scroll-fade-y` / `scroll-fade-x` — vertical / horizontal
 * - `scroll-fade-{t,b,l,r,s,e}` — single edge (logical `s`/`e` mirror in RTL)
 * - `scroll-fade-<n>` / `-[<value>]`, `scroll-fade-{t,b,s,e}-<n>` — fade depth
 * - `scroll-fade-none` — disable (variant-friendly, e.g. `md:scroll-fade-none`)
 */

const SIZE = 'min(12%, calc(var(--spacing) * 10))'
const REVEAL = 'var(--scroll-fade-reveal, calc(var(--spacing) * 24))'

export const scrollFadeRules: Rule[] = [
  ['scroll-fade-none', { '--scroll-fade-mask': 'none' }, { layer: 'default' }],
  // Per-edge first, so `t/b/s/e` aren't swallowed by the both-edges rule.
  [/^scroll-fade-([tbse])-\[(.+)\]$/, ([, e, v]) => ({ [`--scroll-fade-${e}-size`]: v }), { layer: 'default' }],
  [/^scroll-fade-([tbse])-(\d+)$/, ([, e, n]) => ({ [`--scroll-fade-${e}-size`]: `calc(var(--spacing) * ${n})` }), { layer: 'default' }],
  [/^scroll-fade-\[(.+)\]$/, ([, v]) => ({ '--scroll-fade-size': v }), { layer: 'default' }],
  [/^scroll-fade-(\d+)$/, ([, n]) => ({ '--scroll-fade-size': `calc(var(--spacing) * ${n})` }), { layer: 'default' }],
]

export const scrollFadePreflight: Preflight = {
  layer: 'default',
  getCSS: () => `
@property --scroll-fade-t { syntax: "<length-percentage>"; inherits: false; initial-value: 0px; }
@property --scroll-fade-b { syntax: "<length-percentage>"; inherits: false; initial-value: 0px; }
@property --scroll-fade-s { syntax: "<length-percentage>"; inherits: false; initial-value: 0px; }
@property --scroll-fade-e { syntax: "<length-percentage>"; inherits: false; initial-value: 0px; }
@property --scroll-fade-mask { syntax: "*"; inherits: false; }
@keyframes scroll-fade-reveal-t { from { --scroll-fade-t: 0px; } to { --scroll-fade-t: var(--_scroll-fade-size-t, var(--scroll-fade-size, ${SIZE})); } }
@keyframes scroll-fade-reveal-b { from { --scroll-fade-b: var(--_scroll-fade-size-b, var(--scroll-fade-size, ${SIZE})); } to { --scroll-fade-b: 0px; } }
@keyframes scroll-fade-reveal-s { from { --scroll-fade-s: 0px; } to { --scroll-fade-s: var(--_scroll-fade-size-s, var(--scroll-fade-size, ${SIZE})); } }
@keyframes scroll-fade-reveal-e { from { --scroll-fade-e: var(--_scroll-fade-size-e, var(--scroll-fade-size, ${SIZE})); } to { --scroll-fade-e: 0px; } }
.scroll-fade, .scroll-fade-y {
  --_scroll-fade-size-t: var(--scroll-fade-t-size, var(--scroll-fade-size, ${SIZE}));
  --_scroll-fade-size-b: var(--scroll-fade-b-size, var(--scroll-fade-size, ${SIZE}));
  --scroll-fade-block: linear-gradient(to bottom, transparent 0, #000 var(--scroll-fade-t, 0px), #000 calc(100% - var(--scroll-fade-b, 0px)), transparent 100%);
  -webkit-mask-image: var(--scroll-fade-mask, var(--scroll-fade-block)); mask-image: var(--scroll-fade-mask, var(--scroll-fade-block));
  -webkit-mask-composite: source-in; mask-composite: intersect; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
}
@supports (animation-timeline: scroll()) { .scroll-fade, .scroll-fade-y { animation: scroll-fade-reveal-t 1ms ease-in-out, scroll-fade-reveal-b 1ms ease-in-out; animation-timeline: scroll(self y), scroll(self y); animation-range: 0 ${REVEAL}, calc(100% - ${REVEAL}) 100%; animation-fill-mode: both; } }
@supports not (animation-timeline: scroll()) { .scroll-fade, .scroll-fade-y { --scroll-fade-t: var(--_scroll-fade-size-t); --scroll-fade-b: var(--_scroll-fade-size-b); } }
.scroll-fade-x {
  --_scroll-fade-size-s: var(--scroll-fade-s-size, var(--scroll-fade-size, ${SIZE}));
  --_scroll-fade-size-e: var(--scroll-fade-e-size, var(--scroll-fade-size, ${SIZE}));
  --scroll-fade-inline: linear-gradient(to right, transparent 0, #000 var(--scroll-fade-s, 0px), #000 calc(100% - var(--scroll-fade-e, 0px)), transparent 100%);
  -webkit-mask-image: var(--scroll-fade-mask, var(--scroll-fade-inline)); mask-image: var(--scroll-fade-mask, var(--scroll-fade-inline));
  -webkit-mask-composite: source-in; mask-composite: intersect; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
}
.scroll-fade-x:where([dir="rtl"], [dir="rtl"] *) { --scroll-fade-inline: linear-gradient(to left, transparent 0, #000 var(--scroll-fade-s, 0px), #000 calc(100% - var(--scroll-fade-e, 0px)), transparent 100%); }
@supports (animation-timeline: scroll()) { .scroll-fade-x { animation: scroll-fade-reveal-s 1ms ease-in-out, scroll-fade-reveal-e 1ms ease-in-out; animation-timeline: scroll(self inline), scroll(self inline); animation-range: 0 ${REVEAL}, calc(100% - ${REVEAL}) 100%; animation-fill-mode: both; } }
@supports not (animation-timeline: scroll()) { .scroll-fade-x { --scroll-fade-s: var(--_scroll-fade-size-s); --scroll-fade-e: var(--_scroll-fade-size-e); } }
.scroll-fade-t { --_scroll-fade-size-t: var(--scroll-fade-t-size, var(--scroll-fade-size, ${SIZE})); --scroll-fade-mask: linear-gradient(to bottom, transparent 0, #000 var(--scroll-fade-t, 0px), #000 100%); -webkit-mask-image: var(--scroll-fade-mask); mask-image: var(--scroll-fade-mask); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; }
@supports (animation-timeline: scroll()) { .scroll-fade-t { animation: scroll-fade-reveal-t 1ms ease-in-out; animation-timeline: scroll(self y); animation-range: 0 ${REVEAL}; animation-fill-mode: both; } }
@supports not (animation-timeline: scroll()) { .scroll-fade-t { --scroll-fade-t: var(--_scroll-fade-size-t); } }
.scroll-fade-b { --_scroll-fade-size-b: var(--scroll-fade-b-size, var(--scroll-fade-size, ${SIZE})); --scroll-fade-mask: linear-gradient(to bottom, #000 0, #000 calc(100% - var(--scroll-fade-b, 0px)), transparent 100%); -webkit-mask-image: var(--scroll-fade-mask); mask-image: var(--scroll-fade-mask); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; }
@supports (animation-timeline: scroll()) { .scroll-fade-b { animation: scroll-fade-reveal-b 1ms ease-in-out; animation-timeline: scroll(self y); animation-range: calc(100% - ${REVEAL}) 100%; animation-fill-mode: both; } }
@supports not (animation-timeline: scroll()) { .scroll-fade-b { --scroll-fade-b: var(--_scroll-fade-size-b); } }
.scroll-fade-l { --_scroll-fade-size-s: var(--scroll-fade-s-size, var(--scroll-fade-size, ${SIZE})); --scroll-fade-mask: linear-gradient(to right, transparent 0, #000 var(--scroll-fade-s, 0px), #000 100%); -webkit-mask-image: var(--scroll-fade-mask); mask-image: var(--scroll-fade-mask); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; }
@supports (animation-timeline: scroll()) { .scroll-fade-l { animation: scroll-fade-reveal-s 1ms ease-in-out; animation-timeline: scroll(self x); animation-range: 0 ${REVEAL}; animation-fill-mode: both; } }
@supports not (animation-timeline: scroll()) { .scroll-fade-l { --scroll-fade-s: var(--_scroll-fade-size-s); } }
.scroll-fade-r { --_scroll-fade-size-e: var(--scroll-fade-e-size, var(--scroll-fade-size, ${SIZE})); --scroll-fade-mask: linear-gradient(to right, #000 0, #000 calc(100% - var(--scroll-fade-e, 0px)), transparent 100%); -webkit-mask-image: var(--scroll-fade-mask); mask-image: var(--scroll-fade-mask); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; }
@supports (animation-timeline: scroll()) { .scroll-fade-r { animation: scroll-fade-reveal-e 1ms ease-in-out; animation-timeline: scroll(self x); animation-range: calc(100% - ${REVEAL}) 100%; animation-fill-mode: both; } }
@supports not (animation-timeline: scroll()) { .scroll-fade-r { --scroll-fade-e: var(--_scroll-fade-size-e); } }
.scroll-fade-s { --_scroll-fade-size-s: var(--scroll-fade-s-size, var(--scroll-fade-size, ${SIZE})); --scroll-fade-mask: linear-gradient(to right, transparent 0, #000 var(--scroll-fade-s, 0px), #000 100%); -webkit-mask-image: var(--scroll-fade-mask); mask-image: var(--scroll-fade-mask); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; }
.scroll-fade-s:where([dir="rtl"], [dir="rtl"] *) { --scroll-fade-mask: linear-gradient(to left, transparent 0, #000 var(--scroll-fade-s, 0px), #000 100%); }
@supports (animation-timeline: scroll()) { .scroll-fade-s { animation: scroll-fade-reveal-s 1ms ease-in-out; animation-timeline: scroll(self inline); animation-range: 0 ${REVEAL}; animation-fill-mode: both; } }
@supports not (animation-timeline: scroll()) { .scroll-fade-s { --scroll-fade-s: var(--_scroll-fade-size-s); } }
.scroll-fade-e { --_scroll-fade-size-e: var(--scroll-fade-e-size, var(--scroll-fade-size, ${SIZE})); --scroll-fade-mask: linear-gradient(to right, #000 0, #000 calc(100% - var(--scroll-fade-e, 0px)), transparent 100%); -webkit-mask-image: var(--scroll-fade-mask); mask-image: var(--scroll-fade-mask); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; }
.scroll-fade-e:where([dir="rtl"], [dir="rtl"] *) { --scroll-fade-mask: linear-gradient(to left, #000 0, #000 calc(100% - var(--scroll-fade-e, 0px)), transparent 100%); }
@supports (animation-timeline: scroll()) { .scroll-fade-e { animation: scroll-fade-reveal-e 1ms ease-in-out; animation-timeline: scroll(self inline); animation-range: calc(100% - ${REVEAL}) 100%; animation-fill-mode: both; } }
@supports not (animation-timeline: scroll()) { .scroll-fade-e { --scroll-fade-e: var(--_scroll-fade-size-e); } }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
`,
}
