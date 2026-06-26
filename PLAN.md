# `@antfu/design` — Project Plan

> A shared design system for Anthony Fu's devtools-style Vue apps: a customizable,
> **composable** UnoCSS preset (`presetAnthonyDesign`), a set of Vue primitive components and
> recipes, a ground-up design skill, and a color-contrast a11y check. Something in between a
> component library and shadcn.

**Status:** Planning. This document is the source of truth for scope and architecture.
Nothing is built yet. Key decisions are now locked (see [§15](#15-decisions-resolved--remaining-assumptions)).

---

## Table of contents

1. [Goals and non-goals](#1-goals-and-non-goals)
2. [Positioning: library ↔ shadcn](#2-positioning-library--shadcn)
3. [Research summary (what we vendor from)](#3-research-summary-what-we-vendor-from)
4. [Package and repo layout](#4-package-and-repo-layout)
5. [The UnoCSS preset (single, not self-contained)](#5-the-unocss-preset-single-not-self-contained)
6. [Design tokens and theming](#6-design-tokens-and-theming)
7. [Component library (primitives)](#7-component-library-primitives)
8. [Recipes and high-level components (deferred)](#8-recipes-and-high-level-components-deferred)
9. [Composables and utilities](#9-composables-and-utilities)
10. [The skill (ground-up)](#10-the-skill-ground-up)
11. [Accessibility and the contrast-check script](#11-accessibility-and-the-contrast-check-script)
12. [Project setup and tooling](#12-project-setup-and-tooling)
13. [Testing strategy](#13-testing-strategy)
14. [Storybook / documentation](#14-storybook--documentation)
15. [Decisions (resolved) & remaining assumptions](#15-decisions-resolved--remaining-assumptions)
16. [Migration strategy for the source projects](#16-migration-strategy-for-the-source-projects)
17. [Milestones / roadmap](#17-milestones--roadmap)
18. [Risks](#18-risks)

---

## 1. Goals and non-goals

### Goals

- **One shared design layer** across all of Anthony's projects so they are easier to
  maintain and easier for agents to generate consistently.
- Ship four coordinated artifacts under one name:
  1. a **composable, customizable UnoCSS preset** — `presetAnthonyDesign` (framework-agnostic),
  2. a set of **Vue components + recipes** (Vue-focused),
  3. a **ground-up design skill** — "how to do good design with `@antfu/design`",
  4. a **color-contrast a11y check script** (adapted from config-inspector).
- **Preserve the existing look and feel.** The target projects should be refactorable onto
  `@antfu/design` with minimal visual diff. We are extracting and unifying what already
  exists, not redesigning it.
- **Factory-style customization** modeled on [`@antfu/eslint-config`](https://github.com/antfu/eslint-config):
  one entry that takes an options object, normalizes `boolean | object` toggles, and returns
  a composable result — and, crucially, is itself **composed of smaller composable presets**.
- **Comprehensive tests and a Storybook** so the primitives are documented, visually
  reviewable, and regression-safe.
- **License: MIT.**

### Non-goals (this iteration)

- **No shadcn-style copy-in CLI.** Distribution is the installed package only.
- **No Nuxt module** and **no Nuxt-style `n-` / `context`-color theming system.**
- **No auto-import resolver.** Components are imported explicitly.
- **No code / diff viewer components** this iteration (heavy shiki/Monaco/CodeMirror deps;
  the source projects disagree on which — defer).
- Not React/Svelte/Solid components. The **preset is framework-agnostic**; the **components
  are Vue 3 only**. (The skill's guidance can stay multi-framework where relevant.)
- Not a Tailwind build, not CSS-in-JS. UnoCSS only.

---

## 2. Positioning: library ↔ shadcn

With no copy-in CLI, "between a component library and shadcn" is now a matter of **ethos, not
mechanism**:

- **Like a library:** installed via `pnpm add @antfu/design`, imported explicitly, versioned,
  updated centrally. This is what actually deduplicates the source projects.
- **Like shadcn:** components are deliberately **thin, token-driven, and readable** — no heavy
  abstraction layer, no opaque theming runtime. Styling lives in UnoCSS tokens (the preset),
  so a component's markup is short and obvious. They are easy to understand, easy to override
  via props + tokens, and easy to copy by hand into a project in the rare case a fork is
  needed (the `./components/*` subpath export keeps each component self-contained for exactly
  this), but there is no automated registry/CLI doing it for you.

The point: own the *tokens*, keep the *components* simple enough that you rarely need to fork
them, and when you do, it's a manual copy of one readable file.

---

## 3. Research summary (what we vendor from)

We inspected all eight source projects plus `starter-ts`, `eslint-config`, and the
`antfu-design` skill. The load-bearing findings:

### Reference repositories

The source projects studied (token dialect, components, utilities, a11y scan):

- [antfu/node-modules-inspector](https://github.com/antfu/node-modules-inspector)
- [eslint/config-inspector](https://github.com/eslint/config-inspector)
- [vitejs/devtools — packages/rolldown](https://github.com/vitejs/devtools/tree/main/packages/rolldown)
- [antfu-collective/vite-plugin-inspect](https://github.com/antfu-collective/vite-plugin-inspect)
- [antfu/ghfs](https://github.com/antfu/ghfs)
- [unocss/unocss — interactive](https://github.com/unocss/unocss/tree/main/interactive)
- [unocss/unocss — packages-integrations/inspector](https://github.com/unocss/unocss/tree/main/packages-integrations/inspector)
- [nuxt/devtools](https://github.com/nuxt/devtools)

Plus the direct blueprints: [`@vitejs/devtools-ui`](https://github.com/vitejs/devtools/tree/main/packages/ui)
(the preset/shortcuts/color "v0"), [`@antfu/eslint-config`](https://github.com/antfu/eslint-config)
(the options-factory pattern), and [`antfu/starter-ts`](https://github.com/antfu/starter-ts)
(project setup + CI/release conventions).

### The closest existing blueprints

- **[`@vitejs/devtools-ui`](https://github.com/vitejs/devtools/tree/main/packages/ui)** — a
  publishable package exporting a UnoCSS preset, **portable** `shared-shortcuts.ts`
  (deliberately Wind3/Wind4 compatible), raw `.vue` primitives, `composables/dark`, and
  `utils/color`. This is essentially `@antfu/design` v0; our job is to generalize it and make
  the preset properly composable.
- **[`@nuxt/devtools-ui-kit`](https://github.com/nuxt/devtools/tree/main/packages/devtools-ui-kit)** —
  a prefixed component library + shipped preset. We take its component coverage as a checklist
  but **reject** its `n-`/`context`-color theming mechanism (per decision) and its Nuxt-module
  distribution.

### The canonical token dialect

The **semantic `*-base` shortcut layer** — `bg-base`, `color-base`, `border-base`,
`bg-active`, `color-active`, `border-active`, `op-fade`/`op-mute`, `btn-action`,
`badge-color-*` — is used by 7/8 projects and is exactly what the antfu-design skill
prescribes. It is our single source of truth. (No `context`-color layer.)

### Consensus primitives (appear in most/all projects → build first)

Badge (+ hash-colored), Button / IconButton, NumberDisplay / NumberBadge / unit / byte-size
/ duration / date display, file-path/ModuleId display, FileIcon, Tabs / SegmentControl,
Dropdown, Tooltip, Modal/Dialog, Drawer, DarkToggle, EmptyState, Loading,
Checkbox/Radio/Switch/Select/TextInput, SearchField, Kbd, Card, SectionBlock (collapsible),
SplitPane, virtual-list wrapper, "show more" expandable list.

### Shared code that is already de-facto a library

- `getHashColorFromString(name, opacity)` + `getHsla(hue, opacity)` — deterministic
  string→HSL color (hue-based "to adapt better contrast in light/dark mode"), duplicated
  across vite-devtools and vite-plugin-inspect.
- `Badge.vue` / `DisplayBadge.vue` — duplicated byte-for-byte.
- The floating-vue popper override CSS (`bg-tooltip color-base rounded border border-base …`).
- `NumberBadge` / `NumberWithUnit` / `DurationDisplay` logic.
- config-inspector's **axe-core color-contrast** a11y scan (`tests/e2e/specs/a11y.spec.ts`) —
  the basis for our contrast script (§11).

### What diverges (must be configurable, never hard-coded)

| Concern | Range observed | Decision |
|---|---|---|
| **Primary color** | green `#49833E` (nmi/skill), purple (eslint), `#bd34fe` (vite), orange (rolldown), blue (ghfs), cyan (uno) | Theme option; default = antfu green (assumed, §15) |
| **UnoCSS base** | Wind4 (vite-devtools), Wind3 (nmi/ci/ghfs/uno-interactive), presetUno (vpi/uno-inspector) | Composed & toggleable; default Wind4; base-agnostic shortcuts |
| **Fonts** | DM Sans/DM Mono (majority + skill), Inter/Space Mono (eslint), Inter/IBM Plex (uno) | Theme option; default DM Sans/DM Mono |
| **Overlays** | floating-vue (5/8), reka-ui (ghfs), self-rolled (nuxt), splitpanes | **reka-ui + floating-vue + splitpanes**, CSS overridden to our tokens |
| **Dark near-black** | `#111`, `#121212`, `#151515`, `#080808`, `neutral-900` | Theme option; default `#111` |
| **Icon set** | catppuccin / vscode-icons / octicon / ph / carbon | FileIcon takes a configurable map |
| **z-index layers** | only ghfs & vite-devtools formalize named layers (conflicting) | Unify into one named scheme in the preset |

---

## 4. Package and repo layout

A **pnpm monorepo** (following `starter-ts`'s workspace + catalog setup), publishing a
**single package `@antfu/design`** with rich subpath exports, plus a Storybook app and a
playground.

```
porto/                              # repo (working dir; codename "porto")
├── packages/
│   └── design/                     # the published package: @antfu/design (ships raw source at root, no build)
│       ├── components/             # Vue primitives in category subfolders, prefixed; NO barrel — full-path imports
│       │   ├── Action/             # ActionButton.vue, ActionIconButton.vue, ActionDarkToggle.vue
│       │   ├── Display/            # DisplayBadge.vue, DisplayNumber.vue, DisplayFilePath.vue, …
│       │   ├── Form/               # FormTextInput.vue, FormSelect.vue, …
│       │   ├── Overlay/            # OverlayModal.vue, OverlayDropdown.vue, OverlayTooltip.vue, …
│       │   ├── Layout/             # LayoutCard.vue, LayoutTabs.vue, LayoutSplitPane.vue, …
│       │   └── Feedback/           # FeedbackSpinner.vue, FeedbackTip.vue, FeedbackToasts.vue (controlled), …
│       ├── utils/                  # color, format, path, icon, semver, tree, keybinding, contrast, misc (pure, stateless)
│       ├── unocss/                 # the composable preset (framework-agnostic)
│       │   ├── index.ts            # presetAnthonyDesign(options) — composes sub-presets
│       │   ├── theme.ts            # presetAnthonyTheme  (tokens/scales/fonts/z-layers)
│       │   ├── shortcuts.ts        # presetAnthonyShortcuts (base-agnostic semantic layer)
│       │   ├── rules.ts            # presetAnthonyRules (badge-color-*, bg-glass, ...)
│       │   └── severity.ts         # presetAnthonySeverity (color-scale-*)
│       ├── styles/                 # composable CSS files + index.css (--af-* custom props)
│       ├── a11y/                   # contrast-check: index.ts (programmatic) + cli.ts (tsx-runnable)
│       ├── skill/                  # the ground-up skill, shipped via skills-npm
│       │   └── antfu-design/       # SKILL.md + references/
│       ├── test/                   # vitest + snapshots + DOM tests (import the source directly)
│       ├── scripts/gen-tokens.ts   # tokens-table generator (preset → README + skill)
│       └── package.json            # exports → source; published via `files` glob; no `.` barrel, no `bin`
├── storybook/                      # Storybook app (also the a11y scan target)
├── playground/                     # tiny Vite+Vue app to dogfood
├── pnpm-workspace.yaml             # catalogs (cli/testing/types/inlined)
├── eslint.config.js                # antfu({ type: 'lib', vue: true, unocss: true, pnpm: true })
├── tsconfig.json
└── PLAN.md
```

### Proposed `package.json` exports

The package **ships raw `.ts` / `.vue` source** (no bundler) — the source lives at
the package root (not under `src/`) and is published via the `files` glob. There
is **no `.` root barrel and no components barrel**: components are imported by
**full path**, so the public interface is just a few subpaths.

```jsonc
{
  "name": "@antfu/design",
  "type": "module",
  "exports": {
    "./unocss": "./unocss/index.ts", // presetAnthonyDesign + sub-presets
    "./utils": "./utils/index.ts", // pure, stateless helpers
    "./a11y": "./a11y/index.ts", // programmatic contrast check
    "./styles.css": "./styles/index.css", // all styles at once
    "./styles/*": "./styles/*", // composable individual style files
    "./components/*": "./components/*", // full-path SFC imports, e.g. ./components/Display/DisplayBadge.vue
    "./package.json": "./package.json"
  },
  "files": ["a11y", "components", "styles", "unocss", "utils", "skill"]
}
```

Components are imported by full path, e.g.
`import DisplayBadge from '@antfu/design/components/Display/DisplayBadge.vue'`.
No `.` barrel, no `./composables` (the package holds no state), no `bin` (the a11y
scan is the programmatic `./a11y` export, plus a `tsx`-runnable `a11y/cli.ts`). No
`./nuxt`, `./resolver`, or CLI registry — out of scope. The consumer's build
compiles the `.ts`/`.vue`; UnoCSS must scan the package for the components' classes.

---

## 5. The UnoCSS preset (single, not self-contained)

> **Updated decision:** the design layer is now a **single preset**
> `presetAnthonyDesign` — not an umbrella over four sub-presets. (The internal
> `theme` / `shortcuts` / `rules` / `severity` modules remain, but they are
> private build helpers, not exported presets.) UnoCSS only generates *used*
> classes, so there are no `shortcuts`/`rules`/`severity` toggle options — an
> unused layer costs nothing. Sections below describing the umbrella / à-la-carte
> sub-presets are superseded by this single-preset shape.

Two principles still hold:

1. **One preset, not self-contained.** It contributes only the antfu design layer
   (theme tokens + semantic shortcuts + dynamic rules + severity). It bundles
   **no** base preset, icons, web-fonts or reset.
2. **It composes with, rather than swallowing, the base.** The design layer
   (shortcuts/rules) is written **base-agnostic** so it works on Wind4, Wind3, or
   Mini — the consumer supplies the base preset.

### Public API — convenience umbrella

```ts
import { presetAnthonyDesign } from '@antfu/design/unocss'
import { presetIcons, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetAnthonyDesign({
      // theme overrides
      primary: '#49833E', // string | full color scale object
      darkBackground: '#111',

      // design-layer toggles (default true; for finer control, compose sub-presets)
      shortcuts: true, // semantic *-base layer
      rules: true, // badge-color-*, bg-glass, ...
      severity: true, // color-scale-{neutral..critical}

      // escape hatches
      theme: { /* deep-merged */ },
      extendShortcuts: [],
    }),

    // The base preset and integrations are YOURS to compose — presetAnthonyDesign
    // bundles NONE of them. A base preset is required (it provides the underlying
    // utilities the semantic shortcuts expand into).
    presetWind4(), // base: wind4 | wind3 | mini
    presetIcons(),
    presetWebFonts({ fonts: { sans: 'DM Sans', mono: 'DM Mono' } }),
  ],
})
```

`presetAnthonyDesign()` is **only** the antfu design layer (theme tokens, semantic
shortcuts, rules, severity). It does not wrap `presetWind4`/`presetIcons`/`presetWebFonts`/
reset — you add those yourself, with your own versions and options. This is the whole point
of "composable, not self-contained."

### Public API — à la carte composition (the "composable" path)

```ts
import {
  presetAnthonyRules,
  presetAnthonySeverity,
  presetAnthonyShortcuts,
  presetAnthonyTheme,
} from '@antfu/design/unocss'
import { presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(), // your own base, your own version/options
    presetAnthonyTheme({ primary: '#0969da' }),
    presetAnthonyShortcuts(), // base-agnostic; works on wind3/wind4/mini
    presetAnthonyRules(),
    presetAnthonySeverity(),
  ],
})
```

`presetAnthonyDesign(options)` is just a thin aggregator that returns a `Preset` whose nested
`presets: [...]` are exactly the four antfu sub-presets (theme/shortcuts/rules/severity),
selected/configured from `options` — never the base or integrations. Using the umbrella and
hand-composing the antfu parts produce identical output.

### Behavioral rules (from the eslint-config factory)

- **`resolveSubOptions` normalization**: `severity: true` and `severity: { ... }` both work;
  a boolean collapses to `{}`. One helper, used for every toggle.
- **Sensible defaults**: the design-layer toggles (`shortcuts`/`rules`/`severity`) default
  `true`; for finer control, compose the sub-presets directly.
- **Named layers** (stable shortcut-group and rule names) so consumers can override precisely.
- **No third-party preset imports**: `presetAnthonyDesign` never imports or bundles
  `presetWind*`/`presetIcons`/`presetWebFonts`/reset. `unocss` is a `peerDependency` the
  consumer provides, along with their chosen base + integration presets.
- **Footgun guards**: validate option shapes; throw prefixed, actionable errors (incl. a
  clear note when no base preset is present, since the shortcuts need one to resolve).

### Framework-agnostic guarantee

The preset has **zero Vue imports** — pure UnoCSS config — so React/Svelte/Solid projects
(and the skill's multi-framework guidance) can consume the same tokens.

---

## 6. Design tokens and theming

The token vocabulary is the contract between preset, components, recipes, and skill. We
standardize the **union** of what the projects already use, keeping the skill's names verbatim.

### Core semantic shortcuts (`presetAnthonyShortcuts`)

```
color-base / color-muted / color-faint
bg-base / bg-secondary / bg-active / bg-hover
border-base / border-mute / border-active / ring-base
color-active
op-fade (op65 dark:op55) / op-mute (op30 dark:op25)
bg-tooltip / bg-glass(:N) / bg-code / bg-gradient-more
btn-action / btn-action-sm / btn-action-active / btn-icon / btn-primary
badge / badge-active / badge-muted
```

Written **base-agnostic** so they resolve correctly under Wind4, Wind3, or Mini (the
`shared-shortcuts.ts` from vite-devtools-ui is the proven template).

### Canonical tokens table (single source of truth)

This table is the contract. It is **generated from `presetAnthonyTheme` / `presetAnthonyShortcuts`**
and embedded verbatim into the README and the skill's `core-tokens` reference, so docs, skill,
and code can never drift (see §18). Values below are the defaults (overridable via theme options).

**Surfaces**

| Token | Purpose | Light | Dark |
|---|---|---|---|
| `bg-base` | primary surface | `white` | `#111` |
| `bg-secondary` | raised / secondary surface | `#eee` | `#222` |
| `bg-active` | pressed / selected tint | `#8881` | `#8881` |
| `bg-hover` | hover tint | `primary/5` | `primary/5` |
| `bg-code` | inline code background | `gray-500/5` | `gray-500/5` |
| `bg-tooltip` | glass popover surface | `white/75` + blur | `#111/75` + blur |
| `bg-glass(:N)` | translucent panel | `white/N` + blur | `#111/N` + blur |

**Text**

| Token | Purpose | Light | Dark |
|---|---|---|---|
| `color-base` | primary text | `neutral-800` | `neutral-200` |
| `color-muted` | secondary text | `neutral-600` | `neutral-400` |
| `color-faint` | tertiary text | `neutral-500` | `neutral-500` |
| `color-active` | accent text | `primary-600` | `primary-300` |

**Borders / rings**

| Token | Purpose | Light | Dark |
|---|---|---|---|
| `border-base` | default border | `#8882` | `#8882` |
| `border-mute` | subtle border | `#8881` | `#8881` |
| `border-active` | accent border | `primary-600/25` | `primary-400/25` |
| `ring-base` | focus / active ring | `#8882` | `#8882` |

**Opacity**

| Token | Purpose | Light | Dark |
|---|---|---|---|
| `op-fade` | de-emphasized | `op65` | `op55` |
| `op-mute` | strongly muted | `op30` | `op25` |

**Composite shortcuts** (expand to multi-utility recipes)

| Token | Purpose |
|---|---|
| `btn-action` / `-sm` / `-active` | bordered icon/text button + size + active state |
| `btn-icon` / `btn-primary` | square icon button / filled primary button |
| `badge` / `-active` / `-muted` | chip base + states |
| `badge-color-{name}` | chip tinted by color name (`{c}-400/20 text-{c}-700 …` ⇄ dark) |

**Severity scale** (`color-scale-*`)

| Token | Light | Dark |
|---|---|---|
| `color-scale-neutral` | `gray-700` | `gray-300` |
| `color-scale-low` | `lime-700` | `lime-300` |
| `color-scale-medium` | `amber-700` | `amber-300` |
| `color-scale-high` | `orange-700` | `orange-300` |
| `color-scale-critical` | `red-700` | `red-300` |

**Named z-index layers** (ascending): `z-nav` < `z-dropdown` < `z-tooltip` < `z-toast` <
`z-modal-backdrop` < `z-modal-content` < `z-drawer-backdrop` < `z-drawer-content`.

**Typography**: `font-sans` = DM Sans, `font-mono` = DM Mono; extra sizes `text-micro` /
`text-mini` / `text-compact`. **Color scales**: `primary` (default antfu green `#49833E`),
plus `neutral` / `warning` / `success` / `error`.

### Theme scales (`presetAnthonyTheme`)

- **Colors**: full `primary` ramp (default antfu green) + `neutral/warning/success/error`
  semantic ramps (config-inspector has the most complete reference set). All overridable.
- **Typography**: skill's extra sizes `micro`, `mini`, `compact`; fonts DM Sans / DM Mono.
- **Named z-index layers**: one unified scheme (`z-nav`, `z-dropdown`, `z-tooltip`, `z-toast`,
  `z-modal-backdrop`, `z-modal-content`, `z-drawer-backdrop`, `z-drawer-content`) reconciling
  the conflicting ghfs / vite-devtools sets.

### Severity scale (`presetAnthonySeverity`)

`color-scale-{neutral,low,medium,high,critical}` (gray→lime→amber→orange→red, dark-aware),
unifying the duplicated severity/freshness/staleness ramps.

### Dynamic rules

- `badge-color-(\w+)` → tinted bg/text/border tuple (the shared formula).
- `bg-glass(:\d+)?` → translucent surface + backdrop-blur.
- `bg-dots(-\d+)?` / `bg-grid(-\d+)?` → dot-grid / crosshatch background with a
  variable cell size in px (real UnoCSS `rules` emitting `background-image` +
  `background-size`; default 16). These replace the former `bg-dots.css`.
- (No `n-(.*)` context-color rule — removed per decision.)

### Dark mode

**Dark mode is the consuming app's to own — the package ships no `isDark` /
`toggleDark` state.** Class-based on `<html>` + `color-scheme` is the expected
convention, but the app holds the state. Components that vary by scheme take a
`colorScheme: 'light' | 'dark'` prop (default `'light'`); `ActionDarkToggle` is a
**controlled** component (`colorScheme` prop + `update:colorScheme` event) that
still provides the **view-transition circular-reveal** (respecting
`prefers-reduced-motion`). Pure color utils (`getHashColorFromString`, `getHsla`,
`labelStyle`) take an explicit dark flag rather than reading global state.

### Styles (composable, like the preset)

Built-in styles are split into small, individually-importable CSS files, with an `index.css`
that imports all of them:

- `base.css` — root `bg-base`/`color-base`, `color-scheme`.
- `scrollbar.css` — thin scrollbar.
- `animations.css` — spinner keyframes, view-transition reveal.
- `reka-ui.css`, `floating-vue.css`, `splitpanes.css` — **token-driven overrides** so all
  three overlay engines recolor automatically with the theme (the "overrided css").

`base.css` defines a small set of CSS custom properties (prefixed **`--af-`**,
e.g. `--af-bg-base`, `--af-color-base`, `--af-tooltip-bg`) for light/dark, which
the overlay-override files reference so they recolor on plain `import` without
needing UnoCSS to process them. (`splitpanes.css` also carries the minimal base
layout so `LayoutSplitPane` works without importing the dependency's CSS.)

Consumers either `import '@antfu/design/styles.css'` (everything) or cherry-pick, e.g.
`import '@antfu/design/styles/floating-vue.css'`. A CSS reset (`@unocss/reset`) is the
consumer's to add, just like the base/icon/font presets — we do not bundle one.

---

## 7. Component library (primitives)

Vue 3 `<script setup>` + `defineModel`, token-driven (no hard-coded colors), self-contained,
explicitly imported (no auto-import). Components are **organized into category subfolders and
prefixed with the category name** (modeled on `@vitejs/devtools-ui`): `Display/DisplayBadge.vue`,
`Form/FormTextInput.vue`, `Overlay/OverlayModal.vue`, `Layout/LayoutCard.vue`,
`Action/ActionButton.vue`, `Feedback/FeedbackTip.vue`. The export name matches the file
(`import { DisplayBadge, ActionButton } from '@antfu/design'`), and `./components/Display/DisplayBadge.vue`
is the granular subpath. Categories: **Action, Display, Form, Layout, Overlay, Feedback.**
Components that vary by color scheme take a **`colorScheme: 'light' | 'dark'`** prop (the
package owns no dark state). Overlay/structured behavior comes from **reka-ui**; tooltips and
lightweight poppers from **floating-vue**; resizable panes from **splitpanes** — all themed via
the global CSS overrides. (The tables below use the original concept names; the shipped export is
the category-prefixed form, e.g. `Badge` → `DisplayBadge`, `Modal` → `OverlayModal`.)

### Tier 1 — universal

| Component | Backing | Notes |
|---|---|---|
| `Badge` | — | hash- or token-colored pill; `variant` subtle/solid, `size`, `icon`. Merge `DisplayBadge`/`Badge`/`NBadge`. |
| `Button` | — | `btn-action` recipe; polymorphic `to`/`href`, `icon`, `variant`, loading. |
| `IconButton` | floating-vue (tooltip) | round op-fade icon button, active state, `#badge`. |
| `NumberDisplay` | — | `Intl.NumberFormat`, `font-mono tabular-nums`, prefix/suffix. |
| `NumberBadge` | — | NumberDisplay in a Badge. |
| `DateDisplay` / `TimeAgo` | floating-vue (tooltip) | relative time, exact-date tooltip, optional colorize. |
| `DurationDisplay` | — | ms/ns → human, severity-colorized. |
| `BytesDisplay` | — | humanized size, severity-colorized, percent-of-total. |
| `Tabs` / `SegmentControl` | reka-ui Tabs | the most duplicated control. |
| `Tooltip` | floating-vue | thin wrapper. |
| `Dropdown` / `Menu` | reka-ui DropdownMenu (or floating-vue for simple cases) | trigger + content. |
| `DarkToggle` | — | renderless + default UI; view-transition reveal. |
| `EmptyState` | — | titled placeholder, `#hint`. |
| `Loading` / `Spinner` | — | spinner + optional text/panel-grid. |

### Tier 2 — forms and overlays

| Component | Backing | Notes |
|---|---|---|
| `TextInput` | — | bordered input, focus ring, `#icon`, clearable. |
| `SearchField` | — | TextInput + search icon + Kbd hint + clear. |
| `Checkbox` / `Radio` / `Switch` | reka-ui | accessible, token-styled. |
| `Select` | reka-ui Select | styled listbox (replaces native/self-rolled variants). |
| `Modal` / `Dialog` | reka-ui Dialog | focus-trapped, backdrop blur, header/footer slots. |
| `Drawer` | reka-ui Dialog | edge-sliding panel, z-drawer layers. |
| `Tip` / `Callout` | — | inline note. |
| `Toast` / `Notification` | reka-ui Toast | provide/inject queue, positions. |
| `Kbd` | — | key chip; resolvable from a command id. |

### Tier 3 — layout, display, data

| Component | Backing | Notes |
|---|---|---|
| `Card` | — | elevated/bordered surface. |
| `SectionBlock` | reka-ui Accordion/Collapsible | collapsible titled section. |
| `SplitPane` | splitpanes | resizable panes, persisted sizes. |
| `Avatar` / `SafeImage` | — | with fallback. |
| `FilePath` / `ModuleId` | floating-vue (tooltip) | truncated mono path via the `HighlightedPath` engine (segment dimming, `.pnpm`→`~`, scope coloring), icon, link. |
| `FileIcon` | — | ext→icon via configurable rule list (catppuccin default). |
| `PackageName` / `PluginName` | — | scoped/namespaced name, scope colored by hash; strips `vite-plugin-`/etc. |
| `Version` | — | `vX.Y.Z` display + prefix logic. |
| `Donut` | — | SVG progress ring for a 0..1 value. |
| `ProportionBar` | — | stacked proportion / percentage bar. |
| `StatusDot` / `StatusPill` | — | severity/state indicator. |
| `Label` | — | per-label colored rounded chip. |
| `VirtualList` | `@tanstack/vue-virtual` | wrapper over TanStack Virtual (fixed/dynamic/window). |
| `ExpandableList` | — | "show N / more / all" + gradient fade + sort toggle. |

> **Out this iteration:** `CodeBlock` / `DiffView` (heavy shiki/Monaco/CodeMirror deps).

### Conventions

- **Category-prefixed names, explicit imports.** Tree-shakeable; readable. Each component
  lives in a category subfolder and is prefixed by it (`DisplayBadge`, `OverlayModal`, …).
- Props/slots designed as a **superset** of existing project variants → migration is
  prop-renames, not rewrites.
- Token-only styling, dark-mode parity, keyboard/focus handling (largely free via reka-ui),
  polymorphic `as` where sensible.

---

## 8. Recipes and high-level components (deferred)

> **Deferred to a future phase.** Per decision, the command palette and these higher-level
> composed components are **not** part of the primitive-focused v1. They are listed here as the
> future backlog so the primitives (§7) are designed to compose into them later; until then they
> stay app-local.

"Recipes" (your "recepits") are higher-level **compositions** of primitives encoding the
data-presentation decisions from the design skill (future `recipes/`):

- **CommandPalette / CommandMenu** — `Modal`/`Dropdown` + `SearchField` + a commands registry:
  fuzzy-filtered, keyboard-navigable command list with `Kbd` hints and a default `⌘K` binding.
- **StatRow / KeyValue** — label + mono value + optional badge.
- **Toolbar / Navbar** — glass sticky bar with search + actions slots.
- **PanelGrid empty state**, **SidebarNav rail**, **collapsible filter group**.

---

## 9. Composables and utilities

A deliberate, large extraction layer — much of this is **duplicated across the source repos
today** and is where agents and humans get the most leverage. `PURE` = framework-agnostic
`utils/` (unit-tested, usable outside Vue); `COMP` = Vue `composables/`. Component-shaped
findings (`CMP`) are routed to §7/§8 and listed at the end. **Built on
[VueUse](https://vueuse.org) wherever it fits** — `useDark`, `useLocalStorage`, `useClipboard`,
`useMagicKeys`, `refThrottled`, `useVModel`, `onClickOutside`, `formatTimeAgo` — we wrap, not
reinvent.

### Top duplications — extract first (each appears in 3+ repos)

- **`utils/color`** `PURE` — `getHashColorFromString(str, opacity?)`, `getHsla(hue, opacity?)`,
  and the separately-duplicated `getPluginColor(name, map?)` + a default brand-hue map
  (`ts/vue/react/node/nuxt/svelte/vite/...`). Present in all 7 repos; maps differ per repo →
  extract the base fn + accept a caller-supplied map.
- **`utils/format`** `PURE` — the formatting logic re-implemented in every badge:
  - `formatNumber` / `formatPercent` (Intl); `formatBytes(bytes, { base: 1024 | 1000, digits })`
    → `[value, unit]` (repos disagree on base → make it an option); `getContentByteSize(str)`.
  - `formatDuration(ms)` → `[value, unit]` + `getDurationColor(ms)` (severity by threshold).
  - `formatTimeAgo` / `formatRelative` (s/m/h/d/mo/y, no-dep variant) + `getAgeColor(ms)`
    (age → `color-scale-*`); `formatDateTime` (Intl, for tooltips).
- **`utils/path`** `PURE` — module-id/path parsing, duplicated byte-for-byte between
  nuxt-devtools and vite-devtools (same `pathe#113` workaround): `getModuleNameFromPath`,
  `isPackageName`, `isNodeModulePath`, `normalizeModulePath`, `parseReadablePath(path, root)`,
  `relativeModulePath(id, root)` (`./` prefix, keep absolute past 3× `../`), node_modules
  basename split, plus the `.pnpm`-aware `getPnpmPackageInfoFromPath` / `getPackageDirPath`
  (`foo+bar@1.2.3_peer` → name/version) and `.pnpm/<pkg>@ver/node_modules` → `~` collapsing.
- **`utils/icon`** `PURE` — `getFileTypeFromModuleId` + a **configurable** rule list
  `{ match: RegExp, name, icon, description }[]` (catppuccin default; vscode-icons/octicon as
  alternates), strips `?v=` query. Backs the `FileIcon` component.
- **`composables/commands`** `COMP` — `createCommandRegistry` / `registerCommands` /
  `useCommands`: register `{ id, title, icon, action, keys?, when? }`, aggregate reactively,
  auto-unregister on unmount. (ghfs's is the most advanced — keybindings + `when` gating.)
  **Deferred with the command palette (§8)** — a genuine 3-repo duplication, but it ships when
  the palette does.
- **`utils/tree`** `PURE` — `toTree(items, getPath)` building a nested tree from `/`-split
  paths, with single-child-chain flattening.

### By category (additional)

- **Version / semver** `PURE` — `parseSemverRange(range)` (cached; splits `||`, normalizes,
  sorts → `{ valid, highest, lowest, parts, bare }`), `compareSemver`, `compareSemverRange`.
- **Persisted / synced state** — **dropped.** No `createPersistedState` /
  `usePersistedPaneSize` / `useExpandState` wrappers; consumers use VueUse
  `useLocalStorage` directly (`LayoutSplitPane` does this internally for its
  optional `storageKey`).
- **Keybindings / platform** `PURE` + `COMP` — `parseChord` / `parseBinding` / `eventToToken` /
  `chordDisplay` / `bindingDisplay`, `isMac`, and **platform glyph rendering** (⌘/⌃/⌥/⇧ vs
  Ctrl/Alt); `useInputFocus()` (suppress shortcuts while typing). Builds on VueUse
  `useMagicKeys`. (Kept for the `Kbd` component; the `useCommand(id)` registry pairing is
  deferred with the palette, §8.)
- **Clipboard** — **no `useCopy` wrapper.** Consumers use VueUse `useClipboard`
  directly. (`useOpenInEditor` remains deferred with the editor integrations.)
- **Color (advanced)** `PURE` — `labelStyle(hex, isDark)` (OKLCH contrast-aware fg/bg/border
  from a base hex, cached) complementing the WCAG `utils/contrast` helpers (§11);
  `createSeverityScale` / level→`{icon,color}` lookup helper.
- **Misc generic** `PURE` — `makeCachedFunction(fn)` + `TupleMap`/`MaybeWeakMap` (memoize by arg
  tuple), `isNumeric`, `nth(n)` (ordinal), `pluralize(count, one, many?)`, `safeJsonParse`,
  `jsonStringifyCircular`, `stringifyUnquoted` (unquoted-key JSON for config display), `toArray`,
  `clamp`.
- **Dark mode** — **not owned by the package.** No `useDark` / `toggleDark` /
  `toggleDarkAnimated`. The app holds the scheme; components take a `colorScheme`
  prop, and the animated **view-transition circular reveal** lives inside the
  controlled `ActionDarkToggle`.
- **Notifications** `COMP` — `provideNotification` / `useNotification` (toast queue).
- **Contrast** `PURE` — WCAG relative-luminance + contrast-ratio helpers (shared with §11).
- **Shiki** `COMP` *(deferred with code/diff, §7 "out")* — `useShikiHighlighter()` (dark-aware
  theme switch) + `utils/html` `escapeHtml`/`sanitizeHtml`. Ships only if inline highlighting
  is later needed.

### Component-shaped findings (→ §7/§8)

`HighlightedPath` (the rich module-id renderer behind the `FilePath` recipe), `BadgeHashed`,
`NumberBadge`/`NumberWithUnit`, `DurationBadge`, `FileSizeBadge`, `FileIcon`, `Version`,
`PackageName`/`PluginName` (scoped-name colorizer), `Donut`, `ProportionBar` (stacked %),
`SafeImage`, `VirtualList` — all backed by the utils above.

> Everything `PURE` is unit-tested and framework-agnostic; `COMP` wraps a `PURE` core where
> possible so the logic stays testable without a DOM.

---

## 10. The skill (ground-up)

Per decision, we do **not** port the existing `antfu-design` skill verbatim. We **rewrite it
ground-up** as **"how to do good design with `@antfu/design`."** It keeps the timeless design
philosophy but reframes everything around this package's real API.

### Shape

- **`SKILL.md`** — entry: when to use it, the core rules, and an index of references.
  Frontmatter follows the repo convention (`name`, `description` with a "Use when…" trigger,
  `metadata.author`, date-based `metadata.version`).
- **`references/`** — one concept per file, category-prefixed:
  - `core-setup` — install `@antfu/design`, wire `presetAnthonyDesign` (umbrella **and**
    à-la-carte), import `styles.css`.
  - `core-tokens` — embeds the **canonical tokens table** (§6, generated from the preset):
    surfaces, text, borders, severity, z-layers, type — the names agents must use verbatim.
  - `core-components` — the component catalog + recipes: when to reach for `NumberDisplay`,
    `Badge`, `FilePath`, `Modal`, etc., with import paths and prop highlights.
  - `best-practices-*` — preserved from the original where still true: class-over-attributify,
    light/dark parity, mono + tabular for technical values, **anti-slop (the dash ban)**, the
    design-read "three dials".
  - `features-data-presentation` — rewritten to point at the actual display components/recipes.
  - `advanced-*` — pattern vocabulary, redesign protocol (kept, lightly updated).
- **Single skill**, not two — the "how to use the components" guidance lives in
  `core-components` rather than a separate skill.

### Sync discipline

The skill embeds config/usage snippets; a test asserts the skill's example config still
type-checks against the real `presetAnthonyDesign` options so guidance and package never drift.

### Packaging & licensing

Shipped as files installed via **`skills-npm`** (the `prepare` mechanism from `starter-ts`).
**License MIT.** Carry attribution for any retained content adapted from the MIT third-party
skills (taste-skill, make-interfaces-feel-better) in the skill's `README.md`.

---

## 11. Accessibility and the contrast-check script

A first-class deliverable, **adapted from config-inspector's `tests/e2e/specs/a11y.spec.ts`**
(which runs `@axe-core/playwright` with the `color-contrast` rule, in light and dark mode,
excluding `.shiki` and `[data-a11y-skip]`).

### What we ship

- **`utils/contrast`** — pure WCAG luminance/ratio helpers (no browser needed) for unit
  testing token pairs (e.g. assert `color-base` on `bg-base` meets AA in both themes).
- **A runnable script** — `antfu-design-a11y` bin + `@antfu/design/a11y` programmatic export —
  that launches a target URL, toggles light **and** dark mode, runs axe-core's `color-contrast`
  rule, prints a readable violation report, and exits non-zero on failure. Supports
  `[data-a11y-skip]` and configurable excludes, mirroring config-inspector.

### How it's used

1. **In our CI:** scan **every Storybook story** in both light and dark modes — every
   component/variant gets contrast coverage automatically.
2. **In consuming projects:** point it at their app/Storybook to guard their own screens
   (so the a11y discipline travels with the design system).

### Why it matters here

The token system leans on hue-based colors chosen to "adapt better contrast in light/dark"
(config-inspector's color composable note). A standing contrast gate keeps that promise as
tokens and themes change, and gives the primary-color override a built-in safety check.

---

## 12. Project setup and tooling

Follow [`antfu/starter-ts`](https://github.com/antfu/starter-ts), extended for Vue + UnoCSS +
monorepo.

| Concern | Choice |
|---|---|
| Package manager | pnpm + **catalogs** in `pnpm-workspace.yaml` |
| Module type | ESM-only (`"type": "module"`); **raw `.ts` / `.vue` source shipped as-is** |
| Build | **None.** No bundler/transpile — `exports` point at the source files, published via the `files` glob; the consumer's build compiles them. (Avoids the SFC-build risk entirely.) `vue-tsc` typechecks; `vitest` tests against source. |
| Lint/format | `@antfu/eslint-config`: `antfu({ type: 'lib', vue: true, unocss: true, pnpm: true })`. No Prettier. |
| Git hooks | `simple-git-hooks` + `nano-staged` (`eslint --fix`) |
| Typecheck | `tsc --noEmit`, `moduleResolution: Bundler`, `verbatimModuleSyntax` |
| Release | `bumpp` + the reusable `sxzz/workflows` release workflow (npm provenance via OIDC) |
| CI | `lint`+`typecheck` job, cross-OS `test` matrix (no build — source-shipped), + an **a11y contrast scan** job (uses `@antfu/ni`, `pnpm/action-setup@v6`) |
| API safety | `tsnapi` API-snapshot test + `tsdown-stale-guard` (per-entry public-surface snapshot) |
| Skills install | `skills-npm` wired into `prepare` |
| Key runtime deps | `reka-ui`, `floating-vue`, `splitpanes`, `@tanstack/vue-virtual`, `@vueuse/core` |
| Peer deps | `unocss` (+ your chosen base/icon/font presets), `vue` |
| Dev/a11y deps | `@axe-core/playwright`, `playwright`, Storybook |
| License | **MIT** |

The SFC compilation path is the main deviation from `starter-ts` (which builds plain `.ts`).
**Decided: ship raw `.vue` source** (the `./components/*` export points at it — consumers run
UnoCSS over it anyway) **alongside** compiled output for direct importers. De-risk the SFC
build in M0.

A small **docs generator** emits the canonical tokens table (§6) from the preset into the
README and the skill's `core-tokens` reference, run in `prepare`/CI so the three never drift.

---

## 13. Testing strategy

Comprehensive, as requested:

1. **Unit (vitest)** for `utils/*` (formatters, color hashing, **contrast helpers**) and
   preset internals (options → expected theme/shortcuts/rules). High coverage, pure functions.
2. **Preset snapshot tests** — generate CSS for a fixture of utility/shortcut classes and
   snapshot it across the option matrix (`base: wind3` vs `wind4`, custom `primary`, à-la-carte
   sub-presets vs umbrella → must match). Guards token regressions and proves composability.
3. **Component tests (@vue/test-utils + happy-dom)** — props/slots/events, `v-model`,
   accessibility attributes, dark-mode class behavior, keyboard interactions.
4. **A11y contrast (axe-core + Playwright)** — every Storybook story, light + dark (§11).
5. **Visual regression** — Storybook + Playwright snapshots of stories in both themes.
6. **API surface snapshot** — `tsnapi` per entry (`.`, `./unocss`, `./utils`, `./a11y`, …).
7. **Publish checks** — `publint` + `@arethetypeswrong/cli` on the built package.

Target: every primitive has unit + component tests + a story; every util has unit tests; the
preset has snapshot coverage across its option matrix **and** an umbrella-vs-à-la-carte
equivalence test.

---

## 14. Storybook / documentation

- **Storybook 8** (Vue3 + Vite builder, `@storybook/vue3-vite`).
- Every primitive and recipe gets stories covering variants, sizes, states, and **light +
  dark** via a global toolbar toggle.
- Stories triple as **living documentation**, **visual-regression fixtures**, and the
  **a11y contrast scan target**.
- A short prose docs surface (Storybook docs pages) covering install, the preset factory
  options + à-la-carte composition, token reference, theming, the a11y script, and the skill.

---

## 15. Decisions (resolved) & remaining assumptions

### Resolved (this turn)

- ❌ No shadcn-style copy-in CLI. Installed package only.
- ❌ No Nuxt `n-` / `context`-color system.
- ✅ Skill **reworked ground-up** → "how to do good design with `@antfu/design`" (§10).
- ✅ Overlays: **reka-ui + floating-vue + splitpanes**, with overridden CSS.
- ❌ No auto-import resolver — explicit imports.
- ✅ **Storybook** (not Histoire).
- ❌ No Nuxt module.
- ❌ No code/diff components this iteration.
- ✅ License **MIT**.
- ✅ Ship a **color-contrast a11y check script**, adapted from config-inspector (§11).
- ✅ UnoCSS preset is **composable, not self-contained** (§5).
- ✅ Preset named **`presetAnthonyDesign`** (sub-presets `presetAnthonyTheme/Shortcuts/Rules/Severity`).
- ✅ Preset **bundles no base/icons/web-fonts/reset** — consumers add those to `presets: []`
  themselves; `presetAnthonyDesign()` is only the antfu design layer.
- ✅ Built-in **styles are composable** too — per-concern CSS files + an `index.css` (§6).
- ✅ Added the **`border-mute`** token.
- ✅ `VirtualList` uses **`@tanstack/vue-virtual`**.
- ✅ **Expanded shared utilities/composables** — mined the source components; prioritized set folded into §9.
- ✅ Ship **raw `.vue`** source (alongside compiled output).
- ✅ Use **VueUse** freely — **directly, not wrapped.** No `useCopy` wrapper (use
  `useClipboard`), no persisted-state wrappers (`createPersistedState` /
  `usePersistedPaneSize` / `useExpandState` — use `useLocalStorage`).
- ✅ **Canonical tokens table** = single source of truth, generated from the preset, embedded in README + skill (§6).
- ⏳ **Command palette + recipes / high-level components deferred** to a future phase; v1 focuses on primitives (§8).
- ✅ Added **detailed build steps** (M0 → first green build) in §17.
- ❌ Dropped `composables/zoom`, `composables/search`, `utils/highlight` — too specific.
- ✅ **Dark mode is the app's, not the package's** — no `isDark`/`toggleDark`. Scheme-dependent
  components take a **`colorScheme: 'light' | 'dark'`** prop; `ActionDarkToggle` is controlled
  (`update:colorScheme`) and keeps the view-transition reveal (§6).
- ✅ **Components categorized into subfolders + category-prefixed** (`Display/DisplayBadge.vue`,
  `Overlay/OverlayModal.vue`, …); categories Action / Display / Form / Layout / Overlay / Feedback (§7).
- ✅ Built-in **CSS custom properties use the `--af-` prefix** (`--af-bg-base`, …) (§6).
- ✅ **Ship raw `.ts` / `.vue` source as-is** — no bundler/transpile (no tsdown build). Source lives
  at the **package root** (not `src/`), published via the `files` glob; `exports` point at the source (§4).
- ✅ **No `.` barrel and no components barrel** — components are imported by **full path**
  (`@antfu/design/components/Display/DisplayBadge.vue`), keeping the public interface small (§4, §7).
- ✅ **Package is fully stateless** — removed the notification queue + `useInputFocus`; no `./composables`
  export. Toasts are a controlled `FeedbackToasts` (app owns the array). Use VueUse directly for state.
- ✅ **No `bin`** — the a11y scan is the programmatic `@antfu/design/a11y` export (plus a `tsx`-runnable `a11y/cli.ts`).
- ✅ **Thorough JSDoc** (description + `@param`/`@returns`/`@example`) across the utils and preset public API.
- ✅ **Single preset** — `presetAnthonyDesign` is one preset (no umbrella, no exported sub-presets, no toggles). (§5)
- ✅ **Use `@antfu/utils`** for generic helpers (`clamp`, `toArray`, …) instead of shipping our own; re-exported from `./utils`.
- ✅ **Use `colorjs.io`** for all color manipulation (WCAG contrast/luminance, OKLCH `labelStyle`, ramp generation) instead of hand-rolled math.

### Assumed unless you object

- **Default base preset = Wind4** (toggleable to Wind3/Mini/false).
- **Default primary = antfu green `#49833E`** (fully overridable).
- **Repo = monorepo, one published package** (`@antfu/design`) with subpath exports.
- **Sub-preset names** as above (`presetAnthonyTheme`, etc.) — bikeshed welcome.

---

## 16. Migration strategy for the source projects

Goal: each project drops its local copies and consumes `@antfu/design` with **near-zero
visual diff**. Per project:

1. Replace the local `uno.config.ts` token block with `presetAnthonyDesign({ primary, fonts,
   base })` (or hand-compose the sub-presets) set to that project's existing values.
2. Visually diff (Storybook/playground or the app) until the diff is empty.
3. Replace local primitives with library imports, one family at a time, behind a visual check.
4. Delete the dead local components + duplicated utils (`getHashColorFromString`, etc.).

Suggested order (lowest risk → highest): **vite-plugin-inspect** and **unocss-inspector**
(small, plain Vite) → **node-modules-inspector** / **config-inspector** / **ghfs** (already
share the `*-base` dialect) → **vite-devtools rolldown** (already nearly this) → **unocss
interactive** (different accent/fonts) → **nuxt/devtools** (the `n-` dialect; the heaviest
lift, treated last). Each migration is its own PR gated on a visual review; the first
(vite-plugin-inspect) validates the real-world API.

---

## 17. Milestones / roadmap

- **M0 — Scaffold.** starter-ts setup, monorepo, tsdown SFC build, eslint, vitest, CI, an
  empty preset + one component (`Badge`) end-to-end with a story and tests. Validates the
  whole toolchain (esp. SFC build + Storybook + a11y scan wiring).
- **M1 — Composable preset + tokens + styles.** `presetAnthonyDesign` umbrella + the four
  antfu sub-presets (theme/shortcuts/rules/severity), composing no base/integrations; theme,
  semantic shortcuts (incl. `border-mute`), rules, severity, z-layers; composable styles
  (`index.css` + per-engine override files); snapshot tests, umbrella↔à-la-carte equivalence
  test, dark toggle; the canonical tokens-table generator (emits §6 from the preset).
- **M2 — Tier 1 primitives.** Badge, Button, IconButton, the display family, Tabs/SegmentControl,
  Tooltip, Dropdown, EmptyState, Loading, DarkToggle — each with tests + stories.
- **M3 — Forms + overlays (Tier 2).** Inputs, Checkbox/Radio/Switch/Select, Modal, Drawer,
  Toast, Kbd, SearchField — on reka-ui.
- **M4 — Layout/data (Tier 3 primitives).** Card, SectionBlock, SplitPane, FilePath, FileIcon,
  PackageName, Version, Donut, ProportionBar, StatusPill, VirtualList, ExpandableList. (Recipes
  and high-level components are deferred — §8.)
- **M5 — Skill + a11y.** Ground-up skill (embeds the generated tokens table) + `skills-npm`
  wiring; embed the table into the README; finalize the contrast script (bin + programmatic)
  and the CI story-scan; `utils/contrast` unit tests.
- **M6 — First migration + release.** Refactor vite-plugin-inspect onto `@antfu/design`; fix
  API gaps found in real use; cut `0.1.0`. Then roll out remaining migrations.
- **Future — Recipes and high-level components.** The command palette (+ commands registry),
  Toolbar/Navbar, StatRow, SidebarNav, and the rest of §8, once the primitives have proven out
  in real migrations.

### Detailed build steps (M0 → first green build)

Concrete, ordered tasks to get from empty repo to a passing CI with one real component:

1. **Scaffold the monorepo (starter-ts conventions).** Root `package.json` (private; `-r`
   scripts for build/test/lint), `pnpm-workspace.yaml` with `packages/*` + `storybook` +
   `playground` and named catalogs; `eslint.config.js` = `antfu({ type: 'lib', vue: true,
   unocss: true, pnpm: true })`; `tsconfig.json` (Bundler, `verbatimModuleSyntax`); `.gitignore`;
   `simple-git-hooks` + `nano-staged`; `.github/workflows/{ci,release}.yml` (reuse `sxzz/workflows`).
2. **Create `packages/design`.** `package.json`: `type: module`, the subpath `exports` map (§4),
   `bin`, `files`, peer deps (`unocss`, `vue`), runtime deps (`reka-ui`, `floating-vue`,
   `splitpanes`, `@tanstack/vue-virtual`, `@vueuse/core`).
3. **Wire the SFC build (riskiest — do first).** `tsdown.config.ts` with `dts`, `exports: true`,
   `publint: true`, a Vue plugin so `.vue` compiles, entries for `index`/`unocss`/`composables`/
   `utils`/`a11y`. Verify raw `.vue` is also published (`./components/*` resolves to source) and
   `publint` + `attw` pass.
4. **Preset skeleton.** `presetAnthonyTheme` (primary + scales + `micro/mini/compact` + z-layers),
   `presetAnthonyShortcuts` (the §6 token table), `presetAnthonyRules`, `presetAnthonySeverity`,
   and the `presetAnthonyDesign` aggregator. Export all from `./unocss`.
5. **Composable styles.** `styles/{base,scrollbar,animations,reka-ui,floating-vue,
   splitpanes}.css` + `index.css`.
6. **Core utilities.** `utils/color` (`getHashColorFromString`, `getHsla`) + `utils/format`
   first; unit-test them.
7. **First component end-to-end: `Badge`.** Token-driven (no hard-coded colors), explicit export
   from `index.ts` and `./components/Badge.vue`.
8. **Storybook.** Init `@storybook/vue3-vite` in `storybook/`; global light/dark toolbar toggle;
   a `Badge` story (variants/sizes/states × light/dark).
9. **Tests.** `Badge` component test (`@vue/test-utils` + happy-dom); preset snapshot +
   umbrella↔à-la-carte equivalence on a class fixture; `tsnapi` API snapshot for `.` and `./unocss`.
10. **A11y + tokens generator.** Add `@axe-core/playwright`; a script scanning the Badge story in
    light + dark for `color-contrast`. Add the tokens-table generator and write it into the README.
11. **Green CI.** ci.yml runs lint + typecheck + build + test + a11y; confirm it passes on a PR.
    Wire `bumpp` + the release workflow (no publish yet).

After M0 is green, M1–M5 fan out per the milestones above.

---

## 18. Risks

- **"No visual change" vs unification.** Projects diverge on primary color, fonts, and Wind3
  vs Wind4. Mitigated by theme options + visual diffs; some projects will need explicit
  per-project theme config (expected, not a regression).
- **Composable-preset correctness.** Sub-presets risk ordering/resolution bugs, and since the
  umbrella adds no base, a consumer can forget to add `presetWind*` (shortcuts then won't
  resolve). Mitigate with base-agnostic shortcuts, a clear error when no base is detected, the
  umbrella↔à-la-carte equivalence test, and prominent docs/skill guidance.
- **SFC build in an ESM/tsdown pipeline.** Compiling `.vue` (and shipping raw `.vue`) is the
  main unproven part of the toolchain. De-risk in M0.
- **Three overlay engines.** reka-ui + floating-vue + splitpanes each need CSS overrides kept
  in sync with tokens; risk of visual drift between them. Mitigate by driving all overrides
  from the same token set and snapshotting them.
- **Skill/package drift.** Mitigated by the type-check test on the skill's example config.
- **Scope creep toward a general UI kit.** Keep the aesthetic opinionated; resist
  brand-neutral generalization beyond the theme options listed.
```