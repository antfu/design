# `@antfu/design` — improvement & coverage roadmap

What to **improve** in the existing primitives and what to **add** so the package
covers more of the real devtools UIs it's meant to serve. Every item below is
grounded in two things: (1) the per-repo gaps in [MIGRATIONS-CHECK.md](./MIGRATIONS-CHECK.md),
and (2) a source-level verification pass over the *current* package — so nothing
here is "add X" when X already exists (those are listed in §6 so we don't
re-litigate them).

**Legend.** Priority: **P0** unblocks everything · **P1** high leverage ·
**P2** valuable · **P3** big / deferred. Effort: **S** ≤½ day · **M** 1–3 days ·
**L** >3 days.

---

## 0. The one architectural win — a `colorScheme` context (P0 · S)

**Finding.** The package is correctly stateless, and most components don't need a
scheme at all — static styling flips automatically from the `html.dark` class +
`--af-*` tokens in `styles/base.css`. But the **5 components that compute colors in
JS** (`DisplayBadge`, `DisplayLabel`, `DisplayPackageName`, `DisplayProportionBar`,
plus `ActionDarkToggle`) take a `colorScheme` prop that **defaults to `'light'`**,
with **no provide/inject and no composable** anywhere in the package. So on a dark
page, any hash-colored badge/label whose `:color-scheme` wasn't hand-threaded
silently renders light-mode colors. **Every repo in the audit flagged this
prop-drilling as the #1 migration friction.**

**Recommendation.** Add an *opt-in* scheme context. Keep prop-driven as the default
(package stays stateless-by-default — the context only *reads* an app-owned ref):

```ts
// composables/colorScheme.ts  (new)
export const colorSchemeKey: InjectionKey<Ref<'light' | 'dark'>>
export function provideColorScheme(scheme: MaybeRefOrGetter<'light' | 'dark'>): void
export function useColorScheme(prop?: () => 'light' | 'dark' | undefined): ComputedRef<'light' | 'dark'>
```

In the 5 components, resolve `props.colorScheme ?? inject(colorSchemeKey)?.value ?? 'light'`.
One behavior-relevant change: drop the `withDefaults(..., { colorScheme: 'light' })`
to `undefined` so an injected value can win. Optionally ship a thin
`<DesignProvider :color-scheme>` wrapper for app roots.

**Why it matters.** Turns "thread `:color-scheme` to every Display component" into a
one-line `provideColorScheme(() => isDark ? 'dark' : 'light')` at the app root — the
single biggest reduction in migration cost, for ~½ day of work, with zero change to
the pure `utils/color.ts` API.

---

## 1. Improve existing components (P1)

These are the daily-driver devtools primitives; each gap was hit by a real repo.

| Component | Gap (verified missing) | Why / who needs it | Effort |
|---|---|---|---|
| **DisplayPackageName** | Ignores the package's own `getPluginColor` + `defaultBrandHues` + `stripPluginPrefix` — uses generic `getHashColorFromString`, never strips `vite-plugin-`/`unplugin-`/`vite:`/`__load__`, no compact namespace mode | The util is already in the box; a plugin/package list gets generic hues + uncompacted names. Hit by vite-plugin-inspect, rolldown, nmi, config-inspector | **S** |
| **DisplayFilePath** | No query-string (`?v=`, `?vue&type=`) stripping/coloring in the visible path; no `:line:col` suffix; only `href` (no `@click`/open-in-editor event); `~/` pnpm-collapse glyph hard-coded; dimming not toggleable | Module lists show raw `?import` suffixes; "open in editor" is the standard devtools action. Hit by vite-plugin-inspect, rolldown, nuxt | **M** |
| **DisplayBytes** | `digits` never forwarded to `formatBytes` (decimal precision uncontrollable); no icon slot | nmi/rolldown wanted precision control + an icon | **S** |
| **DisplayDuration** | Accepts `ms` only — no nanosecond/microsecond input | Build/transform timings are often ns/µs (rolldown, vite-plugin-inspect, nuxt timeline) | **S** |
| **Severity colorizers** (`getBytesColor`/`getDurationColor`/`getAgeColor` and the components using them) | Thresholds hard-coded; the convenience fns don't accept a custom scale (only the low-level `mapSeverity` does) | Repos disagree on thresholds; let `DisplayBytes`/`Duration`/`Date` take a `scale`/`thresholds` prop forwarded to `mapSeverity` | **S** |
| **DisplayStatusPill** | Dot colors are raw `bg-{red,amber,…}-500` literals, not `color-scale-*` severity tokens; no custom color/slot | Won't follow palette theming; used widely as a state indicator | **S** |
| **LayoutVirtualList** | Fixed-height only (no `measureElement` wired), inner-scroller only (no window/page mode), no exposed `scrollToIndex` | The weakest fit vs. what repos used (`vue-virtual-scroller` Dynamic/Window scrollers); `scrollToIndex` is required for keyboard-nav-to-selection. Hit by unocss-interactive, rolldown, nmi | **M** |
| **LayoutExpandableList** | No stepped **More → All**, no `+N` count *badge*, no **reverse/sort** toggle, no title/header slot | nmi's `ExpendableContainer` and ghfs's `ExpandableList` are strictly richer — upstream their options | **S–M** |
| **LayoutTabs** | No router/link tabs (`to`/`href` per tab), no lazy content panels (`TabsContent`) | Nav-style tab bars (config-inspector, nmi view switcher) must be rebuilt by hand | **S–M** |
| **FeedbackToasts** | No `useToast()` composable (every consumer reimplements the array + timers), no `duration`/auto-dismiss, no per-toast `action`, no progress/multi-stage variant | ghfs has a rich ProgressToast it couldn't map; controlled-only is a lot of boilerplate | **M** |
| **OverlayDropdown** | No separators/labels/groups, no submenu, no checkbox/radio items, no `danger` item variant, no shortcut-hint slot | Structured menus force a drop to raw reka-ui | **M** |
| **OverlayDrawer** | No `#footer` slot, no backdrop blur (Modal has both) — asymmetric with Modal | Consistency | **S** |
| **OverlayTooltip** | No virtual-anchor / manual-coordinate API, no `delay`/`triggers`/`shown` | rolldown's `GraphHoverView` anchors a popover to an arbitrary point | **S–M** |
| **ActionIconButton / ActionButton** | IconButton active color not customizable (a repo wanted `text-green-400`) + no `size`; Button `size` only affects the `action` variant; `to` not forwarded when `as="RouterLink"` | Sizing inconsistent across the Action family; real router integration needs `to` passthrough | **S** |
| **DisplayFileIcon** | Only catppuccin preset shipped; no folder/`node_modules` handling; no light-mode icon inversion | A file-tree view can't render folders or invert monochrome icons. Hit by ghfs, vite-plugin-inspect | **S–M** |

---

## 2. New components — cover recurring "not covered" use cases (P1–P2)

Confirmed absent from the package (keyword sweep over `components/` found zero hits),
and each recurred across the audit.

| New component | Demand (repos that hand-rolled it) | Notes / how to build | Priority · Effort |
|---|---|---|---|
| **DisplayAvatar + DisplaySafeImage** | nmi (`SafeImage`, `Authors`), ghfs (`Avatar`, `Author`) | Was in the plan's Tier-3 but **never shipped**. `<img>` with load/error → fallback (initials/icon). Smallest high-value gap | **P1 · S** |
| **FormCombobox / FormAutocomplete** | config-inspector (fuse.js filepath autocomplete), nmi (`PackageSelect`), ghfs | Text field + filtered results dropdown + keyboard nav. Build on reka-ui `Combobox`. The single most-repeated bespoke pattern | **P1 · M–L** |
| **DisplayTree / LayoutTree** | rolldown (`TreeNode`), unocss-inspector (`ModuleTreeNode`), ghfs, nmi | A view component over the existing `utils/tree.toTree` (which already flattens single-child chains) + `LayoutSectionBlock`/`DisplayFileIcon`. The util is there; the component isn't | **P1 · M** |
| **FormField wrapper** (label + description + error + required) + **error/invalid** state on inputs | nmi (`option/Item`), config-inspector; no input today has an error state | Systemic gap — every field hand-renders its `<label>`. A `FormField` + `aria-invalid` plumbing fixes it once | **P1 · M** |
| **DisplayKeyValue / DisplayStatRow** | rolldown (`MetricCard`/`StatsStrip`), nuxt, nmi; a deferred "recipe" in the plan | label + mono value + optional badge/delta. Trivial composition, very common | **P2 · S** |
| **NavBreadcrumb** | nmi (`NavBreadcrumb`), ghfs (`AppBar`) | path/segment trail with separators + overflow | **P2 · S–M** |
| **FormTextarea + FormNumberInput** | general settings/filter panels | Only single-line `FormTextInput` exists today | **P2 · S** |
| **DisplayProgressBar** (+ progress `FeedbackToast` variant) | ghfs (`ProgressToast`), download/scan progress | determinate/indeterminate bar; feeds the toast progress variant in §1 | **P2 · S** |
| **DataTable** | rolldown (`packages/Table`, `Duplicated`), nuxt (`RoutesTable`, `HooksTable`) | sortable columns, sticky header, virtualizable rows (pairs with the VirtualList fix). Bigger surface | **P2 · L** |

---

## 3. Utils & formatting (P1–P2)

| Area | Gap (verified) | Recommendation | Priority · Effort |
|---|---|---|---|
| **i18n** | Locale is hard-coded `'en-US'` in **every** `format.ts` helper (`formatNumber`, `formatPercent`, `formatDuration` unit labels, `formatDateTime`) | Add an optional `locale` option (default keeps `'en-US'`); thread through to `Intl.*`. Real i18n blocker | **P1 · S–M** |
| **Brand hues** | `getPluginColor`'s `defaultBrandHues` is **replace-only** (no merge) and omits common ecosystems (next, astro, remix, deno, bun, pnpm/npm/yarn, vitest, eslint, prettier, webpack present but sparse) | Accept a merge (`{ ...defaultBrandHues, ...custom }` helper or `map` merged by default) + expand the default set | **P1 · S** |
| **`stripPluginPrefix`** | Prefix regex is a hard-coded module constant (`vite-plugin-`/`unplugin-`/… — missing `vite:`, `__load__`) | Make the prefix list a parameter (default keeps current set); add the namespace forms | **P1 · S** |
| **Icon presets** | Only the catppuccin `defaultFileIconRules` ships | Ship `vscodeIconRules` / `octiconRules` as alternates (data only); `getFileType` already accepts a custom list | **P2 · S–M** |
| **`relativeModulePath`** | Docstring promises a `../`-with-3×-cutoff behavior but the code returns out-of-root paths verbatim (no `../` synthesis, no cutoff option) | Either implement the documented behavior with an options arg, or fix the docstring | **P2 · S** |
| **Color helpers** | No generic `toHex`/`lighten`/`darken`/`mix` beyond what `labelStyle` does internally | Add small color-math helpers (the data-viz/charts components would use them) | **P2 · S** |

---

## 4. DX, setup & packaging (P2)

- **A "batteries-included" setup path.** The preset is deliberately composable, so
  *every* consumer must wire the base preset + icons + fonts + reset themselves —
  and two repos (vite-plugin-inspect, unocss-inspector) are still on the legacy
  `presetUno` alias and need a base bump. Ship either an optional
  `presetAnthonyDesignFull()` umbrella (Wind4 + icons + fonts + reset pre-composed)
  **or** a copy-pasteable `uno.config.ts` recipe + a one-paragraph "migrating off
  presetUno" note. *(P2 · S–M)*
- **Ship the ambient types consumers re-declare.** vite-plugin-inspect carries a
  local `splitpanes.d.ts` shim; if `LayoutSplitPane` re-exports those types,
  consumers can drop it. *(P2 · S)*
- **A migration codemod / guide.** MIGRATIONS-CHECK.md is step 1; a small codemod for
  the mechanical renames (local `bg-main`/`border-main`/`status-*`/`icon-btn`
  shortcuts → preset tokens; `logic/color.ts` → `@antfu/design/utils`) would make the
  4–5 "near-superset" repos nearly turnkey. *(P2 · M)*
- **Document the token-deletion win.** The ancestor repos (nmi, config-inspector,
  ghfs, rolldown) can *delete* 20–170 lines of `uno.config.ts` shortcuts on adoption —
  call this out explicitly in the README/skill so it's the headline, not a footnote.
  *(P2 · S)*

---

## 5. Bigger / deferred (P3)

- **CommandPalette / command registry.** Deferred in v1, but the strongest
  upstream-able gap — ghfs (the most advanced: `when`-gating, chord *sequences* like
  `g g`, fuzzy palette) and nuxt both have one. The `Kbd`/keybinding utils already
  ship and already support multi-key sequences; what's missing is the registry
  (`createCommandRegistry`, `useCommands`, `when` gate) + an `Overlay/OverlayCommand`
  built from `OverlayModal` + `FormSearchField`/`FormCombobox` + `LayoutVirtualList`.
  *(P3 · L)*
- **CodeBlock / DiffView.** Explicitly out of v1 (heavy shiki/CodeMirror/Monaco), but
  it's the **most-repeated** uncovered surface (vite-plugin-inspect, rolldown, nuxt,
  config-inspector, both unocss apps, ghfs). Worth a separate opt-in subpackage
  (`@antfu/design/code`) so the core stays light. *(P3 · L)*
- **App-shell recipes.** `Toolbar`/`Navbar` (sticky glass bar — the `bg-glass` token
  exists), `SideNav` rail (rolldown `PanelSideNav`, nuxt `SideNav`), `PanelGrid`
  empty state (nuxt `NPanelGrids` — `bg-dots`/`bg-grid` tokens exist). These are the
  plan's deferred "recipes"; ship once the primitives above land. *(P3 · M)*
- **Markdown renderer.** Recurs (nuxt `NMarkdown`, ghfs `useMarkdown`) but is
  renderer-bound and genuinely app-domain — keep out of scope. *(skip)*

---

## 6. Already solid — do NOT re-add (verified present)

So this roadmap isn't mistaken for "the package is thin" — these were checked in
source and are complete:

- **DisplayBadge** — polymorphic `as`, `color` as boolean/number/palette-name/CSS
  string, `variant` (subtle/solid), `size`, `icon`. ✅
- **DisplayBytes** — `base` (1000/1024), `colorize`, `total` (%-of-total). ✅ (only
  `digits` + icon slot missing)
- **ActionButton** — `variant`, `loading` (spinner + `aria-busy`), `disabled`,
  polymorphic `to`/`href`/`as`, `icon`. **ActionDarkToggle** — controlled,
  view-transition reveal, reduced-motion guard. ✅
- **ActionIconButton** — built-in tooltip, `active`, `#badge` slot, `disabled`. ✅
- **FeedbackToasts** — controlled `items` + `dismiss`, 4 positions, typed variants;
  **FeedbackTip/EmptyState** — types + `#hint`/`#actions`. ✅
- **Overlay Modal/Drawer** — reka-ui focus-trap + scroll-lock; Modal header/footer;
  Drawer 4 sides. ✅
- **LayoutTabs** (reka-ui, segment variant, icon+count), **LayoutSplitPane**
  (`storageKey` persist, horizontal, N panes), **LayoutSectionBlock** (collapsible,
  `v-model:open`), **FormSearchField** (icon + Kbd + clear), **FormTextInput**
  (clearable, focus ring, prefix/suffix), all reka-ui Form controls. ✅
- **utils** — `color` (pure, `dark` is an explicit arg — no global state),
  `labelStyle` (OKLCH), `formatBytes` (`base` option, `[value,unit]`),
  `mapSeverity`/`colorScale` primitives, `keybinding` (multi-key **sequences**
  supported), `semver`, `tree.toTree` (single-child flatten), `contrast` (WCAG), and
  the `misc` helpers. ✅

---

## 7. Suggested sequencing (punch list)

1. **P0** — `colorScheme` context (`provideColorScheme`/`useColorScheme` + 5 components). *Unblocks every migration.*
2. **P1 quick wins (all S)** — `DisplayPackageName` → use `getPluginColor`/`stripPluginPrefix`; `DisplayBytes` `digits`; `DisplayDuration` ns input; configurable severity scales; `DisplayStatusPill` → severity tokens; brand-hue merge + `stripPluginPrefix` param; ship `DisplayAvatar`/`DisplaySafeImage`.
3. **P1 medium** — `LayoutVirtualList` (dynamic height + window mode + `scrollToIndex`); `LayoutExpandableList` (stepped/+N/reverse/title); `FeedbackToasts` (`useToast` + duration + progress); `DisplayFilePath` (query/`:line:col`/`@click`); `FormCombobox`; `DisplayTree`; `FormField` + error states; `i18n` locale.
4. **P2** — `OverlayDropdown` structured items; `DisplayKeyValue`/`StatRow`; `NavBreadcrumb`; `FormTextarea`/`NumberInput`; icon presets; setup recipe + types; codemod.
5. **P3** — `CommandPalette`; `@antfu/design/code` (CodeBlock/DiffView); app-shell recipes (`Toolbar`/`SideNav`/`PanelGrid`); `DataTable`.

> Cross-reference: every gap traces to a repo in
> [MIGRATIONS-CHECK.md](./MIGRATIONS-CHECK.md) "Not covered" / 🟡-partial rows; the
> current-state claims in §1/§3/§6 were verified against the package source.
