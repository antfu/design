---
name: antfu-design
description: Use when building or restyling devtools-style Vue 3 UIs with @antfu/design — wiring the composable UnoCSS preset, using the semantic token vocabulary (bg-base, color-base, badge-color-*, color-scale-*), choosing prefixed primitives (DisplayBadge, ActionButton, DisplayFilePath, OverlayModal, …), and keeping light/dark contrast and the "anti-slop" rules. Reach for it whenever generating or reviewing UI in a project that depends on @antfu/design.
metadata:
  author: antfu
  version: 2026.06.26
---

# Doing good design with `@antfu/design`

`@antfu/design` is a shared design layer for devtools-style Vue apps: a
**composable UnoCSS preset** (`presetAnthonyDesign`), a set of **token-driven Vue
primitives**, and a **color-contrast a11y check**. This skill is how to use it
*well* — the vocabulary, the defaults, and the taste.

## The three rules that matter most

1. **Own the tokens, not the colors.** Never hard-code a hex or a raw Tailwind
   color in app UI. Reach for the semantic layer first: `bg-base`, `color-base`,
   `color-muted`, `border-base`, `op-fade`, `btn-action`, `badge`. They are
   defined once (in the preset) and adapt to light/dark automatically. See
   [references/core-tokens.md](references/core-tokens.md).

2. **Light/dark parity is not optional.** Every surface and text token has a dark
   variant baked in. If you write a one-off color, you have just created a
   dark-mode bug. The standing contrast scan (`@antfu/design/a11y`) will catch the
   worst of it — don't rely on it as a substitute for using the tokens.

3. **No slop.** Technical values are `font-mono tabular-nums`. No em-dash–laden
   prose in UI copy (the **dash ban**). Prefer one obvious affordance over three
   competing ones. See [references/best-practices.md](references/best-practices.md).

## When to reach for what

- Showing a count, size, duration, or date → a **display component**
  (`DisplayNumber`, `DisplayBytes`, `DisplayDuration`, `DisplayDate`), not raw text.
- A status, type, or tag → `DisplayBadge` (hash- or palette-colored) or `DisplayLabel`.
- A file/module path → `DisplayFilePath` (truncates, dims directories, links).
- An overlay → `OverlayModal` / `OverlayDrawer` (reka-ui), a popover → `OverlayTooltip` / `OverlayDropdown`.
- A severity (fresh→stale, fast→slow, small→large) → the `color-scale-*` ramp via
  the display components' `colorize` prop, never ad-hoc red/green.

Components are categorized and prefixed by category (`Display*`, `Form*`,
`Overlay*`, `Layout*`, `Action*`, `Feedback*`). Dark mode is the app's to own —
the package ships no `isDark`/`toggleDark`; components that vary by scheme take a
`colorScheme: 'light' | 'dark'` prop, and `ActionDarkToggle` is controlled.

Full catalog: [references/core-components.md](references/core-components.md).

## Setup

It's a **single preset, not self-contained** — it bundles no base preset,
icons, fonts, or reset. You add those. See
[references/core-setup.md](references/core-setup.md) for wiring the preset,
importing styles, and pointing UnoCSS at the package so the components' classes
get generated.

## References

- [core-setup.md](references/core-setup.md) — install + wire the preset, import styles.
- [core-tokens.md](references/core-tokens.md) — the canonical token table (generated from the preset).
- [core-components.md](references/core-components.md) — the component catalog with import paths.
- [best-practices.md](references/best-practices.md) — class-over-attributify, parity, mono values, the dash ban, the "three dials".
- [features-data-presentation.md](references/features-data-presentation.md) — presenting numbers, sizes, durations, paths.
- [advanced-patterns.md](references/advanced-patterns.md) — composition patterns and a redesign protocol.
