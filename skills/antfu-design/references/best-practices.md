# Best practices

Preserved from the original antfu design philosophy, reframed around the package.

## Class over attributify

Write utilities as **classes**, not attributes. Classes are greppable, sort
cleanly (the UnoCSS ESLint plugin orders them), and read consistently.

```vue
<!-- good -->
<div class="flex items-center gap-2 color-muted">
<!-- avoid -->
<div flex items-center gap-2 color-muted>
```

## Light/dark parity

Never write a one-off color. Every surface/text/border has a token with a dark
variant baked in (`bg-base`, `color-base`, `border-base`, …). A raw `bg-white`
or `text-gray-800` is a dark-mode bug waiting to happen. When you truly need a
custom color, define it through the theme (a `primary`/`warning`/… ramp) so both
modes are covered.

## Layer with the alpha surfaces, not the opaque ones

A nested surface — a card in a panel, an input in a card, the active pill in a
segment track — takes `bg-raised` (or `bg-sunken` for a recessed track). Those
composite over whatever is behind them, so layers nest visibly and a panel that
happens to be translucent (`bg-glass`, a devtools dock) stays translucent.
`bg-base`/`bg-secondary` are the *opaque* surfaces: correct for something that
has to occlude — a modal, a portaled popover, a sticky header — and wrong for
anything merely nested, where they flatten the stack into one tone and punch a
solid rectangle through a glass parent. See
[core-tokens](core-tokens.md#how-to-read-it) for the full table.

## Mono + tabular for technical values

Numbers, sizes, durations, versions, hashes, paths → `font-mono tabular-nums`
so columns align and digits don't jitter. Prefer the display components
(`DisplayNumber`, `DisplayBytes`, `DisplayDuration`, `DisplayVersion`) which already do
this.

## Anti-slop: the dash ban

No em-dash–driven prose in UI copy or generated text. Keep microcopy short and
declarative. Don't pad labels ("Click here to view the…") — name the thing.

## The three dials

When reviewing a screen, tune in this order:

1. **Density** — how much breathing room (`gap`, `p`, line-height). Devtools UIs
   skew dense; be deliberate, not cramped.
2. **Hierarchy** — `color-base` vs `color-muted` vs `color-faint`, weight, size.
   Most text is muted; reserve `color-base` for what matters and `color-active`
   for the one accent.
3. **Affordance** — one obvious action per context. Prefer a single
   `btn-primary` over three competing buttons. Severity via `color-scale-*`, not
   ad-hoc red/green.

## Severity, not vibes

Fresh→stale, fast→slow, small→large all map to the same five-stop ramp
(`color-scale-neutral|low|medium|high|critical`). Use the `colorize` prop on the
display components instead of hand-picking colors per case.
