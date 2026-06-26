# Advanced patterns

## Composition over configuration

The primitives are deliberately thin so you compose them into app-local
patterns rather than reaching for a mega-component:

- **Stat row** — a label + a mono value + an optional `DisplayBadge`:
  `color-muted` label, `DisplayNumber`/`DisplayBytes` value.
- **Toolbar** — a glass sticky bar (`bg-glass z-nav`) with a `FormSearchField` and
  `ActionIconButton`s.
- **Panel** — `LayoutCard` + `LayoutSectionBlock`s; `FeedbackEmptyState` when there's nothing.
- **Detail list** — `LayoutVirtualList` of rows, each a `DisplayFilePath`/`DisplayPackageName` +
  display badges, colorized by one severity dimension.

When such a composition recurs across screens, lift it into a local component —
not into the design system (the system stays primitive-focused).

## Overriding a primitive

Because components are thin and token-driven, overriding is usually a prop or a
token, not a fork. When you genuinely need to fork one, copy the single readable
file from `@antfu/design/components/<Name>.vue` — that subpath exists for exactly
this. Keep using the same tokens so it stays on-theme.

## Redesign protocol

When restyling an existing screen onto `@antfu/design`:

1. **Map colors to tokens first.** Replace every raw color with a semantic token
   (`bg-base`, `color-muted`, `border-base`, `color-scale-*`). Resist new colors.
2. **Swap raw elements for primitives** one family at a time (badges, then
   buttons, then inputs…), checking the visual diff after each.
3. **Run the contrast scan** (`@antfu/design/a11y`, or `tsx …/a11y/cli.ts <url>`) in light *and* dark.
4. **Tune the three dials** (density, hierarchy, affordance) — see best-practices.

The goal of a migration is near-zero visual diff: you are unifying what exists,
not redesigning it. Per-project theme config (primary color, fonts, base) is
expected, not a regression.
