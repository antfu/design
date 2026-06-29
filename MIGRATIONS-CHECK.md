# Migration Check — adopting `@antfu/design` across the reference repos

This audit looks at each of the eight reference repositories that informed the
design of **`@antfu/design`** and answers two questions per repo:

1. **How would it benefit from migrating** — which of its components, utilities,
   and tokens map onto the shipped design system (and what it gains: dedupe,
   accessibility, consistent theming).
2. **What is _not_ covered** — which UI pieces have no `@antfu/design` equivalent
   and must stay app-local (or become future components).

Each section was produced by reading the repo's real component/util source (not
from memory) and mapping it against the shipped catalog. Coverage legend:
**✅ full** (drop-in / 1:1), **🟡 partial** (exists, but the repo variant has
extra features or a different API → wrapper or prop-rename), **❌ not covered**
(no equivalent).

> **Scope note.** `@antfu/design` is the generalization of **`@vitejs/devtools-ui`**
> and used **`@nuxt/devtools-ui-kit`** as a component-coverage checklist. Those two
> library blueprints live inside the `vitejs/devtools` and `nuxt/devtools` repos and
> are analyzed within those repos' sections (see the "Blueprint note" subsections).

## What `@antfu/design` ships (the mapping target)

- **40 components** in six categories — **Action** (Button, IconButton, DarkToggle),
  **Display** (Badge, Bytes, Date, Donut, Duration, FileIcon, FilePath, Kbd, Label,
  Number, NumberBadge, PackageName, ProportionBar, StatusPill, Version),
  **Feedback** (EmptyState, Loading, Spinner, Tip, Toasts), **Form** (Checkbox,
  RadioGroup, SearchField, Select, Switch, TextInput), **Layout** (Card,
  ExpandableList, SectionBlock, SplitPane, Tabs, VirtualList), **Overlay** (Drawer,
  Dropdown + DropdownItem, Modal, Tooltip).
- **Pure utils** (`@antfu/design/utils`): color (hash/HSL/plugin/label), format
  (number/percent/bytes/duration/time-ago + severity colors), path (module-id /
  pnpm / readable-path), icon (ext→icon rules), keybinding (chord parse/display),
  semver, tree, contrast (WCAG).
- **`presetAnthonyDesign`** — a single composable UnoCSS preset contributing the
  semantic `*-base` token dialect (`color-base`, `bg-base`, `border-base`,
  `bg-active`, `op-fade`, `btn-action`, `badge-color-*`, `color-scale-*` severity,
  named `z-*` layers, `bg-glass/dots/grid`). **Composable, not self-contained** —
  the consumer brings the base preset (Wind3/Wind4), icons, fonts, and reset. Theme
  options: primary color, base preset, fonts, dark near-black, FileIcon map, z-index.
- **Stateless** — owns no dark / clipboard / toast state. Scheme-varying components
  take a `colorScheme` prop; toasts are controlled; state comes from VueUse.
- **`@antfu/design/a11y`** — a programmatic axe-core + Playwright color-contrast scan
  (light + dark).
- Backing libs: **reka-ui** (overlays/forms), **floating-vue** (tooltips/poppers),
  **splitpanes** (panes), **@tanstack/vue-virtual** (virtual list).
- **Explicitly out of v1:** CodeBlock / DiffView (heavy shiki/monaco/codemirror) and
  the CommandPalette + command-registry (deferred — the Kbd/keybinding utils ship,
  the palette doesn't).

---

## Summary — all eight at a glance

| # | Repo | Stack (base · primary · overlays) | Alignment | Effort | Headline benefit | Biggest uncovered |
|---|---|---|---|---|---|---|
| 1 | **vitejs/devtools — rolldown** | Wind4 · orange `#ff4100` · floating-vue + splitpanes | ★★★★★ | Low | It's the generalized `@vitejs/devtools-ui` — already imported by path; mostly an import-root rename + stateless conventions | nanovis treemap/sunburst/flamegraph, module graph, monaco viewer/diff, RPC/session panels |
| 2 | **node-modules-inspector** | Wind3 · green `#49833E` · floating-vue only | ★★★★★ | Low–Med | Near-superset token ancestor; delete ~20 shortcuts + dedupe color/format/semver utils + ~10 display/layout components | d3 dependency graph, sunburst/treemap/flamegraph, xterm terminal, npm-domain badges |
| 3 | **config-inspector** | Wind3 · purple `#8080F2` · floating-vue only | ★★★★★ | Low–Med | Design-language ancestor + **origin of the a11y scan**; migration is mostly deletion | flat-config `<details>` tree, GlobItem + Shiki, rule-level icons, options-diff |
| 4 | **ghfs** | Wind3 · blue `#0969da` · reka-ui + floating-vue + splitpanes | ★★★★☆ | Low–Med | Contributed the z-layer scheme, reka overlays, and keybinding engine — near-identical `ui/*` primitives | command palette + registry (deferred), avatars, sparkline, GH detail/diff/markdown |
| 5 | **vite-plugin-inspect** | presetUno/Wind3 · teal · floating-vue + splitpanes | ★★★★☆ | Med | Prototype the system was distilled from; big util/Badge/ModuleId dedupe | CodeMirror diff viewer, vis-network graph, ECharts metrics, transform-stack panel |
| 6 | **unocss — inspector** | presetUno/Wind3 · teal (no token) · floating-vue | ★★★★☆ | Low–Med | Already in the exact stack; **no token layer to unwind** — pure token adoption + global-CSS deletion | CodeMirror editor, utilities Analyzer, Overview dashboard, REPL |
| 7 | **unocss — interactive** | Wind3 · cyan · hand-rolled modal + vue-virtual-scroller | ★★★☆☆ | Low–Med | Clean chrome migration; **off-default theme** (cyan + Inter/IBM Plex) set via options | search engine, rule explorer, live CSS preview, config editor, color table |
| 8 | **nuxt/devtools** | Wind3 · nuxt green `#00DC82` · self-rolled overlays + splitpanes + floating-vue · `n-`/context theming | ★★★☆☆ | High | ui-kit primitives map ~1:1, but **drop the `n-`/context theming layer** (~52 components) + module→path distribution | CommandPalette, CodeBlock/Diff/Markdown, terminal, timeline, domain explorers |

_Alignment = how closely the repo's design language/stack already matches the preset.
Effort = work to actually migrate. The order below (easiest → hardest) follows the
plan's suggested migration sequence._

---

## Cross-repo gaps → candidate components & known deferrals

Recurring "not covered" themes across the eight repos, and what they imply for
`@antfu/design`:

| Gap | Appears in | Status / suggestion |
|---|---|---|
| **Code & diff viewers** (Shiki / CodeMirror / Monaco) | vite-plugin-inspect, rolldown, nuxt/devtools, config-inspector, both unocss apps, ghfs | **Explicitly out of v1.** Heavy deps; stays app-local. Strongest future candidate: a `CodeBlock` / `DiffView` (deferred). |
| **Command palette + registry** (⌘K fuzzy, keybinding dispatch) | ghfs (most advanced), nuxt/devtools | **Deferred from v1.** The `Kbd`/keybinding utils ship; the palette UI + registry don't. Clear candidate for a future `Overlay/OverlayCommand`. |
| **Data-viz** (dependency graphs, treemap/sunburst/flamegraph, sparkline, ECharts, vis-network, vue-flow) | nmi, rolldown, vite-plugin-inspect, nuxt/devtools, ghfs, unocss inspector | App-domain; **out of scope.** Only `DisplayDonut` / `DisplayProportionBar` cover trivial ratio viz. |
| **Avatar / SafeImage** (image with load/error fallback) | node-modules-inspector, ghfs | Listed in the plan's Tier-3 but **not in the shipped 40** — a real gap worth adding. |
| **Data table** (build metrics, duplicated packages) | rolldown, nuxt/devtools | No generic `DataTable` in the catalog — recurring app-local table. |
| **Settings / field row** (label + control + reset-on-dblclick) | node-modules-inspector, config-inspector, qrcode-toolkit | Candidate small `FormFieldRow` / `SettingItem` primitive. |
| **Range / random-range slider** (single value that expands to a min↔max band) | qrcode-toolkit (`SettingsRandomRange`) | Folded into `FormSlider` (`expandable`) — distills the QRT collapsible single↔range pattern, token-driven + reka-ui dual-thumb. |
| **Markdown rendering** | nuxt/devtools, ghfs | Out of scope (renderer-bound); stays app-local. |
| **Icon+title row / sticky search navbar / panel-grid bg** | nuxt/devtools | Trivially recomposed from `ActionButton` / `FormSearchField` + `bg-dots`/`bg-grid` tokens — no 1:1 component needed. |

---

## Universal migration caveats (the package is stateless)

These apply to **every** repo, because `@antfu/design` deliberately owns no runtime
state:

- **Dark mode** — most repos read `isDark` internally (often inside
  `getHsla`/`getHashColorFromString`). The shipped components are stateless: they
  take a **`colorScheme` prop**, and the color utils take a scheme/`dark` argument.
  The app keeps owning `useDark()`; migration threads the scheme through call sites.
  Use the controlled `ActionDarkToggle` for the view-transition reveal.
- **Toasts** — `FeedbackToasts` is controlled. Imperative singletons (e.g.
  nuxt-devtools' `devtoolsUiShowNotification`) must move to a VueUse-backed queue.
- **Clipboard** — no `useCopy` wrapper; keep using VueUse `useClipboard` directly
  (the copy-button icon-swap is the standard `ActionIconButton` pattern).
- **Base preset & reset are consumer-supplied** — `presetAnthonyDesign` is
  composable, not self-contained. Repos still on the legacy `presetUno` alias
  (vite-plugin-inspect, unocss inspector) must pick a current Wind3 or Wind4 base;
  everyone keeps bringing their own icons, fonts, and `@unocss/reset`.
- **Token adoption is mostly deletion** — the repos that predate the system
  (`*-base` dialect users: nmi, config-inspector, ghfs, rolldown) can delete large
  blocks of hand-rolled `uno.config.ts` shortcuts and inherit them from the preset.

---

## 1. vitejs/devtools — packages/rolldown

**Repo:** https://github.com/vitejs/devtools/tree/main/packages/rolldown · also `packages/ui` = @vitejs/devtools-ui (the blueprint)
**Stack:** UnoCSS base = `presetWind4` (via `presetDevToolsUI`, with attributify + icons + typography + web-fonts + variant-group/directives transformers) · primary = orange `#ff4100` (full 50–950 scale overriding the lib's purple `#bd34fe` default) · fonts = DM Sans / DM Mono (local-processed) · dark = near-black `#111` (`bg-base`), dots/grid bg via PNGs, `useDark` storage key `vite-devtools-color-scheme` · overlays = floating-vue (`Tooltip`/`Menu`) + splitpanes + `@floating-ui/dom` (manual positioning) · icons = catppuccin + ph + svg-spinners (`icon-catppuccin` shortcut auto-inverts in light)
**Migration verdict:** This is the closest-to-1:1 migration in the set — `@antfu/design` is the direct generalization of `@vitejs/devtools-ui`, which rolldown already consumes by full path (`@vitejs/devtools-ui/components/*`, `/utils/color`, `/composables/dark`); migration is mostly a rename of the import root plus adopting the stateless `colorScheme`/controlled-toast conventions and setting the orange-primary + Wind4 theme options.

### Covered — how it benefits (repo → @antfu/design)
| Repo component / util | @antfu/design equivalent | Coverage | Benefit / migration note |
|---|---|---|---|
| `display/FileSizeBadge.vue` (bytes + severity color-scale + % of total + icon) | `DisplayBytes` (formatBytes + getBytesColor + getContentByteSize) | ✅ | Drops the hand-rolled `colorScale` ladder and `bytesToHumanSize`; @antfu/design centralizes the severity thresholds and `% of total`. |
| `display/Version.vue` | `DisplayVersion` | ✅ | Identical mono `v…`/scoped-prefix logic; delete local copy. |
| `display/PluginName.vue` (strips `vite:`/`rollup-plugin-`/`unplugin-`…, colors scope) | `DisplayPackageName` (strips prefixes, hash scope color) | ✅ | Same prefix-stripping + scoped-color rendering; back it with the shared util. |
| `display/FileIcon.vue` + `utils/icon.ts` (ModuleTypeRules/PluginTypeRules) | `DisplayFileIcon` + `icon` utils (`getFileType`/`getFileIcon`/`defaultFileIconRules`/`stripPluginPrefix`) | ✅ | The big-win: the whole catppuccin rule table becomes the preset's configurable FileIcon map. |
| `display/HighlightedPath.ts` (segment dimming, `.pnpm`→`~`, scope color, query coloring) | `DisplayFilePath` (truncated mono path, `.pnpm`→`~`, scope color, segment dimming) | ✅ | Among the most intricate local components; @antfu/design ships this exact behavior — large deletion. |
| `utils/filepath.ts` + `shared/utils/filepath.ts` (`parseReadablePath`, `getModuleNameFromPath`, `isPackageName`, `isNodeModulePath`, `getPnpmPackageInfoFromPath`, `normalizeModulePath`) | `path` utils (same names 1:1) | ✅ | These shared utils were literally lifted into the catalog; import from `@antfu/design/utils`. |
| `utils/color.ts` (`getPluginColor` + `predefinedColorMap` brand hues: rolldown 18, vite 250, ssr 270…) | `color` utils (`getPluginColor` + `defaultBrandHues`, `getHashColorFromString`, `getHsla`) | ✅ | `predefinedColorMap` is exactly `defaultBrandHues`; hue-based light/dark contrast logic is identical. |
| `utils/is.ts` (`isNumeric`) + `utils/format.ts` `toTree` + `getContentByteSize` | misc (`isNumeric`, `tree.toTree`) + format (`getContentByteSize`) | ✅ | Tiny helpers already in the catalog. |
| `utils/cache.ts` (`makeCachedFunction`) | misc (`makeCachedFunction`) | ✅ | Same memoization helper. |
| `display/IconButton.vue` (round, op50→hover, active green, title/aria) | `ActionIconButton` (round op-fade + tooltip + active + #badge) | 🟡 | @antfu/design adds tooltip + `#badge` slot; rolldown's `text-green-400` active tint would move to a variant/prop. |
| `DisplayBadge.vue`, `DisplayNumberBadge.vue`, `DisplayDuration.vue`, `DataVirtualList.vue` (consumed from devtools-ui today) | `DisplayBadge`, `DisplayNumberBadge`, `DisplayDuration`, `LayoutVirtualList` | ✅/🟡 | Already devtools-ui imports — straight rename. Note: @antfu/design's `LayoutVirtualList` is `@tanstack/vue-virtual`, whereas devtools-ui/rolldown use `vue-virtual-scroller` (`DynamicScroller`/`WindowScroller`) — API differs, so `VirtualTree.vue` needs a re-wire, not a rename. |
| `display/ExpandableContainer.vue` ("More/All" progressive reveal) | `LayoutExpandableList` | 🟡 | Same intent (incremental list reveal); verify the `+N` badge + gradient-fade affordance is exposed. |
| `display/ClusterBadge.vue` (hash-colored pill + tooltip) | `DisplayBadge` + `OverlayTooltip` | 🟡 | Pill is covered; the namespace-split + explanatory popper stays app-local composition. |
| `visual/Loading.vue` + `visual/LogoBanner.vue` | `FeedbackLoading` / `FeedbackSpinner` (+ logo stays app-local) | 🟡 | The spinner+pulse text pattern maps to `FeedbackLoading`; the Rolldown wordmark SVG stays local (brand asset). |
| `data/SearchPanel.vue` (text input + checkbox filter chips) | `FormSearchField` + `FormCheckbox` | 🟡 | Field/checkbox primitives covered; the rules-toggle/reverse-select orchestration stays app-local. |
| `compare/DeltaValue.vue` / `display/ComparisonMetric.vue` (mono number + unit, signed +/- color) | `DisplayNumber` / `DisplayBytes` / `DisplayDuration` (Intl mono tabular, severity) | 🟡 | Number+unit formatting is covered; the red/green signed-delta tone is a thin app wrapper. |
| `display/TreeNode.vue` (`<details>` folder tree) | `LayoutSectionBlock` (collapsible) for sections; tree-build via `tree.toTree` | 🟡 | Collapsible primitive + tree util exist; the file-tree row rendering itself stays app-local. |
| `panel/SessionSelector.vue` uses `DisplayBadge` + `DisplayTimestamp` | `DisplayBadge` + `DisplayTimeAgo`/`DisplayDate` | ✅ | `DisplayTimestamp` (VueUse `formatTimeAgo`) == `DisplayTimeAgo`. |
| `compare/MetricCard.vue` / `compare/StatsStrip.vue` (stat card shells) | `LayoutCard` + Display* | 🟡 | Card chrome from `LayoutCard`; the metric composition stays app-local. |
| `compare/TabView.vue` (tab strip) | `LayoutTabs`/`SegmentControl` (reka-ui) | 🟡 | Tab UI is covered by the reka-ui component; the per-tab compare logic stays app-local. |
| `flowmap/ModuleFlow.vue` (splitpanes) | `LayoutSplitPane` (splitpanes, persisted) | 🟡 | Same splitpanes engine, now themed via global CSS + persistence built in. |

### Not covered (gaps — stay app-local or need new components)
| Repo component / feature | What it does | Suggestion |
|---|---|---|
| `chart/Treemap.vue`, `plugins/Sunburst.vue`, `assets/Sunburst.vue`, `chart/ModuleFlamegraph.vue`, `chunks/Flamegraph.vue` | nanovis-powered treemap / sunburst / flamegraph bundle visualizations | Stay app-local; bundle-analysis charts are out of scope for a general design system (`DisplayDonut`/`DisplayProportionBar` cover only trivial ratio viz). |
| `display/ModuleGraph.vue`, `modules/Graph.vue`, `chunks/Graph.vue`, `flowmap/*` (`ModuleFlow`, `PluginFlow`, `Node*`, timelines) | Pannable/zoomable module & plugin dependency graphs with virtualized viewport + dragging-scroll composables | App-local; graph layout/zoom/RPC-driven nodes are domain logic. `GraphHoverView.vue` (floating-ui virtual-element popover) is a candidate to fold into `OverlayTooltip` only if it accepts virtual anchors. |
| `code/Viewer.vue`, `code/DiffEditor.vue` | modern-monaco read-only editor + diff (theme synced to dark) | App-local (heavy editor dep); only the dark-sync hook touches the design system. |
| `data/*Loader.vue`, `data/PathSelector(+Item).vue`, `panel/SessionSelector.vue` | RPC data fetching, build-session selection, fuse.js path-pair selection | App-local (RPC/session/birpc domain). |
| `compare/SplitRow.vue`, `SingleSideRow.vue`, `SessionMeta.vue`, `TabView.vue` diff engine | Session-to-session bundle diffing rows/metrics | App-local; the diffing logic is Rolldown-specific (only the row chrome reuses Display*/Card). |
| `display/SafeImage.vue` | `<img>` that only renders after successful preload | Tiny app util; not design-system-shaped. |
| `display/TimeoutView.vue` | Auto-hiding transient message (e.g. "copied") after an interval | Overlaps conceptually with `FeedbackToasts`, but it's an inline ephemeral label — keep local or model as a controlled toast. |
| `modules/BuildMetrics.vue`, `packages/Duplicated.vue`, `packages/Table.vue`, `data/PluginDetailsTable.vue` | Build-metric tables / duplicate-package analysis | App-local data tables (no generic DataTable in the catalog). |

### Blueprint note (@vitejs/devtools-ui → @antfu/design)
- **Absorbed 1:1:** all 11 devtools-ui components — `DisplayBadge`, `DisplayDuration`, `DisplayNumberBadge`, `DisplayNumberWithUnit`, `DisplayTimestamp` (→`DisplayTimeAgo`), `DisplayIconButton` (→`ActionIconButton`), `DisplayCloseButton`, `DataVirtualList` (→`LayoutVirtualList`), `PanelSideNav`, `VisualLoading`/`VisualLogoBanner` (→`FeedbackLoading`/`FeedbackSpinner`) — plus `sharedShortcuts` and the `utils/color` + `utils/format` helpers.
- **Shortcut tokens carried over verbatim:** `color-base/active`, `bg-base/active/secondary/glass/code/tooltip/dots`, `border-base/active`, `op-fade`/`op-mute`, `btn-action`(+`-sm`/`-active`), the `color-scale-neutral…critical` severity ramp, `badge-color-<name>` dynamic shortcut, and the named `z-*` layer set — these are exactly the catalog's "PRESET TOKENS".
- **What generalizing added on top of v0:** theme options (configurable primary color, base preset Wind3/Wind4, fonts, dark near-black, **FileIcon map**, z-index); a much larger Display family (`DisplayBytes`, `DisplayDonut`, `DisplayFilePath`, `DisplayPackageName`, `DisplayProportionBar`, `DisplayStatusPill`, `DisplayNumber`, `DisplayKbd`, `DisplayLabel`, `DisplayVersion`, `DisplayDate`); real Form/Overlay/Layout families on **reka-ui** (`FormSelect`, `LayoutTabs`, `OverlayModal/Drawer/Dropdown`) + **floating-vue** tooltips + **splitpanes** `LayoutSplitPane`; and a pure `@antfu/design/utils` surface (semver, keybinding, contrast, richer path/format/color).
- **Key philosophy shift:** devtools-ui owns **global dark state** in a singleton (`composables/dark.ts` `useDark`, imported directly by rolldown's `LogoBanner`, `code/Viewer`, color utils). @antfu/design is **stateless** — components take a `colorScheme` prop and dark is reveal-toggled via the controlled `ActionDarkToggle`. This is the main behavioral change rolldown must absorb (its `getHsla` currently reads `isDark.value` internally).

### Setup & token alignment
- **Alignment is near-total** because the preset *is* the generalized `presetDevToolsUI`. Migration of `uno.config.ts`: swap `presetDevToolsUI` → `presetAnthonyDesign`, keep the existing orange `primary` 50–950 scale as the theme `primary` option, keep Wind4 as the base preset, keep the DM Sans/DM Mono local-font processor, and keep dark = `#111` (matches `bg-base` default).
- **Composability caveat:** unlike the self-contained v0 preset (which bundles Wind4 + attributify + icons + typography + web-fonts), `presetAnthonyDesign` is composable — the consumer must explicitly bring the base preset, icons, fonts, and reset. Rolldown already supplies all of these, so it's a re-wiring, not new infra.
- **State/reset caveats:** (1) replace the singleton `isDark`/`toggleDark` usage with the `colorScheme`-prop pattern + `ActionDarkToggle`; (2) `getHsla` must receive scheme rather than reading global dark; (3) global CSS (scrollbar vars, `.bg-dots`, `html{--uno: bg-base font-sans}`) stays app-side as the "consumer brings reset" contract expects; (4) overlay theming (floating-vue/splitpanes) moves to the design system's global CSS overrides.

### Top wins
- **Delete the most intricate local code:** `HighlightedPath.ts` (pnpm/scope/query path coloring) and the `utils/filepath.ts`/`shared/utils/filepath.ts` family map 1:1 onto `DisplayFilePath` + the `path` utils — the highest-maintenance components in the app.
- **FileIcon rule table becomes config:** the large catppuccin `ModuleTypeRules`/`PluginTypeRules` map collapses into the preset's configurable FileIcon map, kept in sync centrally.
- **Severity logic centralized:** `FileSizeBadge`'s hand-rolled byte→color ladder and `DisplayDuration`'s ms→severity thresholds move into `getBytesColor`/`getDurationColor`, so the whole color-scale ramp is owned in one place.
- **Brand-hue color system is already the catalog's:** `predefinedColorMap` == `defaultBrandHues`; `getPluginColor`/`getHashColorFromString`/`getHsla` import directly from `@antfu/design/utils`.
- **Stateless dark mode + controlled toasts** remove the app's reliance on devtools-ui's global `isDark` singleton, making the components portable and SSR/multi-instance-safe.
- **Form/Overlay/Layout upgrade for free:** rolldown's raw `<input>` search/checkbox chips, floating-vue menus, and splitpanes flow gain accessible reka-ui `FormSearchField`/`FormCheckbox`/`FormSelect`, `OverlayDropdown/Modal`, `LayoutTabs`, and a persisted `LayoutSplitPane` without bespoke wiring — and the package's a11y color-contrast scan covers the new surface.

---

## 2. node-modules-inspector

**Repo:** https://github.com/antfu/node-modules-inspector · `packages/node-modules-inspector/src/app`
**Stack:** UnoCSS base = **Wind3** (`presetWind3` + attributify + icons + typography + web-fonts) · primary = **green `#49833E`** (WCAG-tuned) · fonts = **DM Sans / DM Mono** (local-processed) · dark = **near-black `#111`** · overlays = **floating-vue only** (`Tooltip`/`Menu` + hand-rolled `Transition` drawer/terminal; no reka-ui, no splitpanes, no vue-virtual) · icons = **Phosphor (`i-ph-*`) + Catppuccin + logos/ri** (Iconify)
**Migration verdict:** **High benefit, low-to-medium effort, exceptional token alignment.** This repo is effectively the design system's ancestor — `uno.config.ts` already defines `color-base`/`bg-base`/`bg-secondary`/`bg-tooltip`/`bg-glass`/`btn-action(-sm/-active)`/`badge-color-*`/`color-scale-*`/`op-fade`/`op-mute` with the same semantics as `presetAnthonyDesign`. Adopting the preset would delete most of these shortcuts and de-duplicate the color/format/semver utils and ~10 display/layout components.

### Covered — how it benefits (repo → @antfu/design)
| Repo component / util | @antfu/design equivalent | Coverage | Benefit / migration note |
|---|---|---|---|
| `utils/color.ts` (`getHashColorFromString`, `getHsla`) | `utils/color` (same names) | 🟡 | Identical hash/HSL algorithm; only difference is the repo reads `isDark.value` internally while the catalog takes a `dark` arg. Swap by threading `colorScheme`/`isDark` at call sites. Catalog also adds `getPluginColor`/`labelStyle`/`defaultBrandHues` for free. |
| `utils/format.ts` (`bytesToHumanSize`) | `formatBytes` + `getBytesColor` | 🟡 | Catalog returns `[value,unit]` like the repo and ships the **same** byte severity scale (80KB/500KB/1MB/10MB) currently inlined in `FileSizeBadge.vue`. |
| `utils/semver.ts` + `shared/semver.ts` (`parseSemverRange`, `compareSemver`, `compareSemverRange`) | `utils/semver` (same names) | ✅ | Direct match incl. the cached range parser used by `NodeVersionRange.vue`. |
| `display/FileSizeBadge.vue` | `DisplayBytes` | 🟡 | Catalog covers bytes + severity + `%-of-total`. Repo extras: configurable `percentRatio` gate, `icon` slot, `colorize` wired to settings. Minor wrapper needed. |
| `display/DurationBadge.vue` / `DateBadge.vue` | `DisplayDuration` / `DisplayDate` + `getAgeColor` | 🟡 | Repo's day/hour age coloring (`180/365/3y/5y`) is the catalog's `AGE_SCALE`; `DateBadge` wraps it with a tooltip. |
| `display/NumberBadge.vue` | `DisplayNumber` / `DisplayNumberBadge` | 🟡 | Same `toLocaleString` + percent format; repo adds prefix/suffix/icon/`after` slot. |
| `display/PackageName.vue` + `PackageSpec.vue` | `DisplayPackageName` | 🟡 | Catalog already implements scope hash-coloring with a `colorScheme` prop. Repo's `PackageSpec` adds deprecation/vuln strike-through styling on top — keep that as a thin wrapper. |
| `display/Version.vue` | `DisplayVersion` | ✅ | Same `vX.Y.Z` / prefix / `:`-range mono rendering. |
| `display/ClusterBadge.vue` | `DisplayLabel` / `DisplayBadge` | 🟡 | Same `getHashColorFromString`-tinted pill (color/border/bg); repo binds it to floating-vue tooltip + namespace split. |
| `ui/Donut.vue` | `DisplayDonut` | ✅ | Same SVG ring, 0..1, `size`/`thickness` props. |
| `ui/Percentage.vue` (+ `PercentageModuleType/Provenance/FileCategories`) | `DisplayProportionBar` | 🟡 | `Percentage` is the generic stacked %-bar = `DisplayProportionBar`; the three `Percentage*` wrappers just feed it domain counts and stay app-local. |
| `ui/EmptyState.vue` | `FeedbackEmptyState` | 🟡 | Repo variant couples title + icon + `badge-color` note; catalog version is more generic with a `#hint` slot. |
| `ui/Drawer.vue` | `OverlayDrawer` | 🟡 | Same edge panel + backdrop + Escape + transitions, but repo hand-rolls with `Transition`; catalog uses **reka-ui Dialog** (focus-trap/a11y win). Behavior-compatible swap. |
| `report/ExpendableContainer.vue` | `LayoutExpandableList` | 🟡 | **Repo variant is richer** — multi-step More/All, `+N` count badges, gradient fade, reverse/sort toggle, titled header. Catalog covers the show-N/more/gradient core; would need the sort + stepped-expand options ported up. |
| `panel/Goto.vue` + `option/PackageSelect.vue` | `FormSearchField` (+ floating-vue) | 🟡 | `Goto` is search-icon + input + clear-button + focus ring = `FormSearchField`/`FormTextInput` shape; the Fuse-powered package autocomplete dropdown stays app-local. |
| `option/Checkbox.vue` | `FormCheckbox` | ✅ | Custom checkbox box + hidden input + primary check; direct match. |
| `option/SelectGroup.vue` | `LayoutTabs` (`variant="segment"`) / segment control | 🟡 | Bordered radio segment switcher; catalog's reka-ui segment control is the a11y-upgraded equivalent. |
| `panel/Nav.vue` round icon buttons + view tabs | `ActionIconButton` + `LayoutTabs` | 🟡 | The repeated `w-10 h-10 rounded-full hover:bg-active` + `v-tooltip` + active-color pattern is exactly `btn-icon`/`ActionIconButton` (incl. the `#badge` slot for the filter count). The 5 RouterLink view buttons map to `LayoutTabs` segment variant. |
| `ui/SubTitle.vue` / `ui/Title.vue` | `LayoutSectionBlock` (titles) | 🟡 | Trivial typographic headers; partially subsumed by section/card primitives. |
| `btn-action` usages (Settings refresh, etc.) | `ActionButton` (`btn-action` recipe) | ✅ | The repo **defines** `btn-action` in uno.config; preset ships it + a polymorphic `ActionButton`. |
| floating-vue `v-tooltip` / `Tooltip` across the app | `OverlayTooltip` + themed `floating-vue.css` | ✅ | Same library; adopt the design system's global floating-vue CSS override for consistent theming. |

### Not covered (gaps — stay app-local or need new components)
| Repo component / feature | What it does | Suggestion |
|---|---|---|
| `chart/Sunburst/Treemap/Flamegraph/SunburstSide` + `NavBreadcrumb` | nanovis/d3 hierarchical size visualizations | App-local. Out of scope for a general design system. |
| `graph/Canvas/Node/Dot` + `composables/zoomElement` | d3-hierarchy dependency graph with pan/zoom, link layers, compare highlight | App-local (this is the product's core). |
| `panel/Terminal.vue` + `state/terminal` | xterm.js terminal with theme-vitesse, fit addon | App-local. |
| `display/ProvenanceBadge`, `SourceTypeBadge`, `DeprecationMessage`, `VulnerabilityMessage`, `NodeVersionRange`, `VersionWithUpdates` | npm-domain badges/callouts (provenance signing, dev/prod source, deprecation, advisories, engines range) | App-local domain components — but they should be rebuilt **on top of** `DisplayStatusPill`/`DisplayLabel`/`FeedbackTip` once migrated. |
| `option/Item.vue` | settings row: fixed-width label + tooltip + reset-on-dblclick + control slot | Not in catalog. Candidate for a small `FormFieldRow`/`SettingItem` primitive if extracted. |
| `panel/Filters*`, `Overview`, `PackageDetails*`, `MaintainerAction*`, `report/*`, `integrations/Publint*` | domain panels/reports/filter UIs | App-local; compose from migrated primitives (cards, badges, expandable lists, proportion bars). |
| `display/SafeImage.vue` | `<img>` with load/error state + fallback slot | Tiny utility; not design-system material (but recurs in ghfs → candidate `SafeImage`/`Avatar`). |
| `display/Authors`/`AuthorEntry`/`FundingEntry`, `ui/Credits`, `ui/Logo`, `ui/NoMobile`, `ui/TimeoutView` | avatars/funding/credits/branding/responsive guards | App-local branding & layout. |
| `grid/Container/Item/Expand`, `tree/Item/Dependencies`, `RenderNextTick` | package grid, dependency tree rows, render-defer helper | App-local; the `<details>`-based `grid/Expand` ≈ `LayoutSectionBlock` collapsible, others are domain. |

### Setup & token alignment
- **Tokens are already a near-superset of the preset.** After adding `presetAnthonyDesign` you can delete most `shortcuts` in `uno.config.ts`: `color-base`, `bg-base`, `bg-secondary`, `bg-tooltip`, `bg-code`, `bg-glass`, `border-base`/`active`, `color-active`/`bg-active`, `btn-action(-sm/-active)`, `op-fade`/`op-mute`, `color-scale-*`, and the `badge-color-(\w+)` matcher — the preset supplies equivalents. Keep app-specific ones: the `z-graph-*`/`z-panel-*`/`z-drawer-*` layer stack, `page-padding*`, `icon-catppuccin`, `bg-gradient-more`, `color-deprecated`.
- **Theme options to set:** `primary` → the existing green ramp (`#49833E` DEFAULT); base preset → **Wind3**; fonts → DM Sans/DM Mono; dark near-black → `#111`. Confirm the preset's `bg-gradient-more`/`bg-glass` opacities match the repo's `:75`/`:80` values or override.
- **Keep base preset + reset + icons + fonts** in `uno.config.ts` — the preset is composable and intentionally does **not** bring Wind3, `@unocss/reset/tailwind.css` (already in `nuxt.config.ts` css), `presetIcons`, or web-fonts.
- **State/reset caveats (stateless package):**
  - **Dark:** repo owns `isDark` via `composables/dark.ts` (VueUse `useDark`). Catalog components don't read it — pass `colorScheme="isDark ? 'dark' : 'light'"` to `DisplayPackageName`/`DisplayLabel`/etc., and thread `isDark` into the now-stateless `getHsla`/`getHashColorFromString`/`getPluginColor` calls. (`color.ts`'s internal `isDark` read is the one real refactor point.)
  - **Clipboard/Toasts:** repo has no toast system today; `FeedbackToasts` is controlled, so wire a VueUse-backed queue if adopted.
  - **Overlays:** repo currently has **no reka-ui or splitpanes** dependency — migrating `Drawer`→`OverlayDrawer`, `SelectGroup`→segment `LayoutTabs`, or adding `OverlayModal`/`OverlayDropdown` pulls in `reka-ui` (and `splitpanes` only if `LayoutSplitPane` is used). floating-vue is already present.

### Top wins
- **Delete ~20 UnoCSS shortcuts** and inherit them from `presetAnthonyDesign` — eliminates the biggest source of token drift since this repo and the preset already agree on semantics.
- **De-duplicate the severity scales:** `FileSizeBadge`, `DurationBadge`, `DateBadge` each inline a `color-scale-*` threshold table that is byte-for-byte the catalog's `getBytesColor`/`getDurationColor`/`getAgeColor`. Replace with `DisplayBytes`/`DisplayDuration`/`DisplayDate`.
- **Adopt the stateless color utils** (`getHsla`/`getHashColorFromString`/`getPluginColor`/`labelStyle`) and drop `utils/color.ts`; this also unlocks brand-hue coloring for `ClusterBadge`/`PackageName`.
- **Swap the hand-rolled `Drawer` for `OverlayDrawer`** and the `SelectGroup` radio switcher for reka-ui-backed `LayoutTabs`/segment control — gains focus-trapping and keyboard a11y the current `Transition`/`<input radio>` versions lack.
- **Replace the repeated round-icon-button pattern in `Nav`/`Terminal`/`Drawer`** (`w-10 h-10 rounded-full hover:bg-active` + `v-tooltip`) with `ActionIconButton` (`btn-icon` recipe, built-in tooltip + `active` + `#badge` for the filter counter).
- **Upstream `ExpendableContainer`'s extra features** (stepped More/All, `+N` count badges, reverse/sort) into `LayoutExpandableList` — the repo has the most complete version of this widget and would benefit from sharing it.

---

## 3. config-inspector

**Repo:** https://github.com/eslint/config-inspector · `app/`
**Stack:** UnoCSS base = `presetWind3` (+ attributify, typography) · primary = `#8080F2` ESLint purple (full neutral/primary/warning/success/rose scales mirrored from eslint.org tokens) · fonts = `Inter` + `Space Mono` (presetWebFonts + local font processor) · dark = `useDark` + `color-neutral-900` near-black · overlays = floating-vue only (`VDropdown` / `v-tooltip`; no reka-ui, no splitpanes) · icons = iconify `ph` / `carbon` / `file-icons` / `vscode-icons` / `logos` / `simple-icons` / `svg-spinners`
**Migration verdict:** High token/preset alignment, medium benefit, low-medium effort. This repo is almost certainly the design-language ancestor of `presetAnthonyDesign` — its `uno.config.ts` shortcuts (`color-base/muted/faint`, `bg-base/tooltip/glass/code/hover`, `border-base/active`, `btn-action(/-sm/-active)`, `badge(/-active/-muted)`, `color/bg/border-active`) are a near-1:1 subset of the catalog preset tokens, and its `composables/color.ts` is the seed of the catalog color utils. Worth migrating to delete the duplicated preset + color/path helpers and adopt shared overlay/form primitives; the rule/config/glob viewers stay app-local. Notably this repo is the **origin of the axe-core color-contrast a11y scan** now shipped as `@antfu/design/a11y`.

### Covered — how it benefits (repo → @antfu/design)
| Repo component / util | @antfu/design equivalent | Coverage | Benefit / migration note |
|---|---|---|---|
| `uno.config.ts` shortcuts (`color-base/muted/faint`, `bg-base/tooltip/glass/code/hover`, `border-base/active`, `btn-action*`, `badge*`, `*-active`) | `presetAnthonyDesign` PRESET TOKENS | ✅ | Delete ~40 lines of hand-rolled shortcuts; consume the preset. Names already match — drop-in. Repo brings its own Wind3 base + ESLint color scales as theme options. |
| `composables/color.ts` → `getPluginColor`, `getHashColorFromString`, `getHsla` | utils `color`: `getPluginColor` + `defaultBrandHues`, `getHashColorFromString`, `getHsla` | ✅ | Exact functions, same hue-map idea. Move `predefinedColorMap` into the `defaultBrandHues`/plugin-color override config. One caveat: repo's `getHsla` reads `isDark` ref internally (stateful) — catalog is stateless, so pass `colorScheme`. |
| `composables/strings.ts` → `nth`, `stringifyUnquoted` | utils `misc`: `nth`, `stringifyUnquoted` | ✅ | Identical helpers; import from `@antfu/design/utils`. `stringifyOptions` (the `[!code muted]` Shiki transform) stays app-local. |
| `ColorizedRuleName.vue` (scope/name split, hash-color scope, `line-through`, badge) | `DisplayPackageName` + `DisplayBadge` | 🟡 | Scope-coloring + prefix-strip + badge wrapper overlaps `DisplayPackageName`; rule-name semantics (plugin prefix, deprecated strike) are app-specific so likely a thin wrapper over the Display primitive. |
| `ConfigItem.vue` plugin pills (`getPluginColor` bg/fg, rounded-full) | `DisplayLabel` (colored chip) | 🟡 | The inline plugin-name chips map to `DisplayLabel` + `labelStyle`; click-to-filter behavior stays local. |
| `NavBar.vue` dark toggle (`toggleDark`, sun/moon icon button) | `ActionDarkToggle` (controlled, view-transition) | 🟡 | Replace bespoke toggle with controlled `ActionDarkToggle` (gains view-transition reveal); repo keeps owning the `useDark` state per the stateless contract. |
| `NavBar.vue` nav buttons + page toolbar buttons (`btn-action` + icon + `active-class`) | `ActionButton` (btn-action recipe, polymorphic to/href, icon, active) | 🟡 | Many `<NuxtLink btn-action>` / `<button btn-action>` instances collapse into `ActionButton`; polymorphic `to`/`href` covers the NuxtLink cases. |
| `RuleItem.vue` Docs/Copy popup buttons (`btn-action-sm` + icon) | `ActionButton` (size sm, icon) | 🟡 | Straight swap; `useClipboard` copy logic stays in the component (stateless package). |
| `NavBar.vue` GitHub icon link + deprecated-count pill button | `ActionIconButton` / `DisplayStatusPill` | 🟡 | Icon link → `ActionIconButton` (round op-fade + tooltip). The warning "Using N deprecated rules" pill ≈ `DisplayStatusPill` (severity) but carries a custom click action. |
| `RuleDeprecatedInfo.vue` DEPRECATED/INVALID chip | `DisplayStatusPill` (severity/state) | 🟡 | The rose severity pill maps to `DisplayStatusPill`; the floating-vue popover body (replacedBy links, version text) stays app-local. |
| rules.vue / configs.vue search `<input>` + magnifier icon | `FormSearchField` (input + search icon + clear) | 🟡 | Two near-identical search inputs become `FormSearchField` (gains clear button + optional Kbd). configs.vue autocomplete dropdown stays custom. |
| configs.vue / files.vue "Show Specific Only" `<input type=checkbox>` | `FormCheckbox` | ✅ | Direct replacement. |
| `OptionSelectGroup.vue` (radio-as-pills segmented filter) | `LayoutTabs / SegmentControl` or `FormRadioGroup` | 🟡 | Functionally a segmented control; catalog's reka-ui SegmentControl covers the common case, but repo's per-option slot + custom per-pill styles (plugin colors, level icons) may need the more flexible `FormRadioGroup`. |
| configs.vue / files.vue view-mode 2-button toggles (Configs/Merged, List/Group, List/Grid) | `LayoutTabs / SegmentControl` | 🟡 | The `btn-action`-pair toggles are segment controls; migrate for consistency, keep the persisted `stateStorage` state local. |
| Empty states ("No matched config items", "No matched files found", italic muted) | `FeedbackEmptyState` | 🟡 | Several ad-hoc empty/italic-muted blocks unify under `FeedbackEmptyState` (with `#hint`). |
| files.vue "experimental … may not be accurate" notice | `FeedbackTip / Callout` | ✅ | Inline note → `FeedbackTip`. |
| `app.vue` / `NavBar.vue` loading spinner (`i-svg-spinners-90-ring-with-bg` + pulse) | `FeedbackSpinner` / `FeedbackLoading` | 🟡 | Loading-config screen + "Fetching updates…" indicator map to `FeedbackSpinner`; the full-panel loading screen ≈ `FeedbackLoading`. |
| `NavBar.vue` `useTimeAgo(meta.lastUpdate)` ("updated X ago") | `DisplayDate / TimeAgo` + util `formatTimeAgo` | ✅ | Swap VueUse `useTimeAgo` for `DisplayTimeAgo` (relative + exact tooltip) / `formatTimeAgo`. |
| `ConfigInspectorBadge.vue` version link (`v{version}`) | `DisplayVersion` (vX.Y.Z) | 🟡 | The `v{version}` superscript ≈ `DisplayVersion`; the logo+title anchor stays bespoke. |
| floating-vue theming in `app/styles/global.css` (`.v-popper__inner` → `bg-tooltip color-base border-base`) | catalog "tooltips via floating-vue, themed by global CSS overrides" | ✅ | Exact pattern the catalog prescribes — replace local override block with the package's shared floating-vue override. |
| `tests/e2e/specs/a11y.spec.ts` (axe-core color-contrast, light+dark, `.shiki`/`[data-a11y-skip]` excludes) | `@antfu/design/a11y` (axe-core + Playwright color-contrast scan) | ✅ | **This file is the upstream origin** of the catalog a11y scan; post-migration, consume `@antfu/design/a11y` instead of maintaining it here. |

### Not covered (gaps — stay app-local or need new components)
| Repo component / feature | What it does | Suggestion |
|---|---|---|
| `ConfigItem.vue`, `FileGroupItem.vue` | Collapsible `<details>` flat-config / file-group cards with index watermark, per-section icons, nested glob/rule/plugin breakdown | Stay app-local. The collapsible shell loosely resembles `LayoutSectionBlock`, but the dense ESLint-specific content is bespoke. |
| `GlobItem.vue` | Glob/ignore pill with Shiki `glob`-lang syntax highlighting, compound-AND intersection, files/configs popovers | App-local — Shiki glob highlighting + match logic is domain-specific. |
| `Shiki.ts` / `composables/shiki.ts` | Shiki code highlighter (vitesse light/dark, muted-line transformer, `filter-hue-rotate`) | App-local — catalog ships no code-highlight component. |
| `RuleLevelIcon.vue` | error/warn/off duotone icon + options/redundant-options dot badge | App-local (ESLint rule-level semantics). `DisplayStatusPill` doesn't cover the icon+dot form. |
| `RuleStateItem.vue` | Rule-state popover detail (level, config link, applies-to globs, options vs defaults diff) | App-local — composed domain panel. |
| `composables/options.ts` (`deepCompareOptions`) + `stringifyOptions` | Diffs rule options vs defaults, marks redundant for Shiki muted-line rendering | App-local — ESLint-specific. |
| `ColorizedConfigName.ts` | Renders ` > `/`:`/`/`-delimited config names with per-segment hash colors | App-local; reuses catalog `getPluginColor` but the segment parser is config-name-specific. |
| `SummarizeItem.vue` | Tiny icon + count + tooltip "summary" stat | App-local; could lean on catalog `DisplayNumber` for the count, but the whole widget is trivial/local. |
| configs.vue fuse.js filepath autocomplete + `HighlightMatch` | Fuzzy filepath autocomplete dropdown with match highlighting | App-local — fuse.js wiring + keyboard nav is custom (no catalog autocomplete/combobox). |
| rules.vue filter engine (state/status/plugin/fuse.js + `watchDebounced`) | Multi-axis rule filtering logic | App-local logic; only its UI controls map to catalog Form/Segment components. |

### Setup & token alignment
- **Preset alignment is exceptionally high** — the repo's `uno.config.ts` shortcuts are essentially the source dialect of `presetAnthonyDesign`. Migration is mostly *deletion*: remove the local shortcuts block and `composables/color.ts`/`strings.ts` helpers, then adopt the preset + `@antfu/design/utils`. The repo's ESLint color scales (`primary #8080F2`, neutral/warning/success/rose) plug in via the preset's **primary-color / base-preset / fonts / dark-near-black theme options**, so brand identity is preserved.
- **State/reset caveats fit the stateless contract.** Repo already owns dark mode (`composables/dark.ts` via `useDark`), clipboard (`useClipboard` in `RuleItem.vue`), and persisted view state (`useLocalStorage` in `composables/state.ts`) — exactly the VueUse-owned state the package expects. Migration must thread `colorScheme`/`isDark` into scheme-varying components (notably `getHsla`/`getPluginColor`, which currently read `isDark` internally). Reset (`@unocss/reset/tailwind.css`) and base preset are already consumer-supplied, matching the "composable, not self-contained" philosophy.
- **Overlay theming already matches.** floating-vue is themed via global `.v-popper__inner` CSS overrides — the exact mechanism the catalog uses — so the local override block in `global.css` is replaced by the package's shared one. No reka-ui or splitpanes are used today, so adopting catalog overlays/panes would be net-new (optional).
- **a11y scan is already upstreamed.** `tests/e2e/specs/a11y.spec.ts` is the origin of `@antfu/design/a11y`; after migration the repo consumes the packaged scan (and its `[data-a11y-skip]` / `.shiki` exclusion convention) instead of maintaining a local copy.

### Top wins
- Delete the duplicated UnoCSS shortcut layer and `color`/`strings` helpers — the catalog preset + `@antfu/design/utils` are a near-exact superset, cutting real maintenance surface.
- Consolidate the many `btn-action` buttons/links, the two search inputs, the checkbox, and the segmented view-toggles/filter pills into `ActionButton` / `FormSearchField` / `FormCheckbox` / `SegmentControl` for consistent focus/hover/a11y behavior.
- Adopt `ActionDarkToggle` (view-transition reveal) and the shared floating-vue CSS overrides, removing bespoke toggle + popover-theming code while keeping `useDark` state local.
- Replace ad-hoc empty/loading/notice blocks with `FeedbackEmptyState` / `FeedbackSpinner` / `FeedbackTip`, and `useTimeAgo` with `DisplayTimeAgo`.
- Stop maintaining the local axe-core contrast spec — switch to `@antfu/design/a11y`, the very scan this repo originated.
- Keep all ESLint-domain UI (flat-config `<details>` tree, GlobItem + Shiki, RuleLevelIcon, options-diff, fuse.js autocomplete) app-local; `@antfu/design` is correctly scoped to primitives and deliberately doesn't cover these.

---

## 4. ghfs

**Repo:** https://github.com/antfu/ghfs · `ui/` (Nuxt 3 SPA, `ssr: false`)
**Stack:** UnoCSS base = `presetWind3` (+ `presetAttributify`, `presetTypography`) · primary = GitHub blue `#0969da` (full `primary` ramp in `theme.colors`) · fonts = `presetWebFonts` DM Sans / DM Mono (local processor) · dark = VueUse `useDark` + `html.dark` class, near-black `#111` (`bg-base`) · overlays = `reka-ui` (Dialog for Modal, Tabs for Settings/Detail) + `floating-vue` (tooltips/dropdowns) + `splitpanes` (list/detail) · icons = `presetIcons` octicon/ph/ri/carbon
**Migration verdict:** High alignment, low-to-moderate effort — ghfs is essentially the reference implementation for several `@antfu/design` pieces. It directly contributed the **named z-index layer scheme** (`z-nav/dropdown/toast/modal-backdrop/...` in `uno.config.ts`), the **reka-ui overlay approach**, and the **command-registry + keybinding engine** (`useCommands.ts` + `parseKey.ts`) that the design study distilled into the shipped `Kbd`/keybinding utils. Adopting the preset would dedupe its shortcut soup (`btn-action`, `badge`, `kbd`, `op-fade`, `color-*`, `date-chip-*`) and the overlay/keybinding utils; the command palette itself stays app-local (deferred from v1).

### Covered — how it benefits (repo → @antfu/design)
| Repo component / util | @antfu/design equivalent | Coverage | Benefit / migration note |
|---|---|---|---|
| `ui/components/ui/IconButton.vue` | Action·ActionIconButton | ✅ | Same round op-fade + floating-vue tooltip + `active` + `#badge` slot. Near-identical; drop in favor of catalog version. |
| `ui/components/ui/Modal.vue` | Overlay·OverlayModal | ✅ | Both wrap reka-ui `Dialog*` with focus trap, `z-modal-backdrop/content`, header/footer slots. |
| `ui/components/ui/SearchField.vue` | Form·FormSearchField | ✅ | input + search icon + `Kbd` hint + clear button — exact catalog shape. |
| `ui/components/ui/Kbd.vue` + `ui/components/ui/WithCommand.vue` | Display·DisplayKbd | ✅ | Renders chord tokens from a command binding; catalog `DisplayKbd` + keybinding utils cover this. `WithCommand` (command→execute/disabled slot) is the app-glue layer. |
| `ui/components/ui/EmptyState.vue` | Feedback·FeedbackEmptyState | ✅ | icon + title + message + size variants; identical. |
| `ui/components/ui/ExpandableList.vue` | Layout·LayoutExpandableList | ✅ | "show top N / More / All" with gradient fade — same pattern (ghfs adds reverse toggle). |
| `ui/components/ui/Badge.vue` + `display/NumberBadge.vue` + `display/StatePill.vue` | Display·DisplayBadge / DisplayNumberBadge / DisplayStatusPill | ✅ | `badge-color-<name>` subtle/solid pills, mono tabular number badge, state pill — all in catalog. |
| `ui/components/display/DateBadge.vue` + `display/DurationBadge.vue` | Display·DisplayDate/TimeAgo + format·formatTimeAgo/`getAgeColor` | ✅ | freshness/staleness color scales = catalog's age severity palette (study even notes node-modules-inspector lineage). |
| `ui/components/ui/Drawer.vue` | Overlay·OverlayDrawer | 🟡 | Same edge-panel role + `z-drawer-*`, but ghfs hand-rolls `<Transition>` instead of reka-ui Dialog; migrating gains focus-trap/a11y for free. |
| reka-ui Tabs in `panel/Settings.vue`, `panel/Detail.vue` (+ `tab-trigger`/`tab-count` shortcuts) | Layout·LayoutTabs/SegmentControl | 🟡 | Currently raw `TabsRoot/List/Trigger/Content`; catalog component would absorb the repeated `tab-trigger` styling. |
| `splitpanes` in `panel/Project.vue` (`listPaneSize`) | Layout·LayoutSplitPane | 🟡 | Same splitpanes lib + persisted size, but ghfs persists via server RPC, not VueUse localStorage (see caveat). |
| `item/List.vue` (`useVirtualizer`) | Layout·LayoutVirtualList | 🟡 | Same `@tanstack/vue-virtual`; catalog wrapper covers the scaffolding, app keeps the Row renderer. |
| `ui/utils/parseKey.ts` (parseChord/parseBinding/chordToken/eventToToken/chordDisplay/bindingDisplay/isMac) | utils·keybinding | ✅ | This *is* the shipped keybinding util — replace local copy with `@antfu/design/utils`. |
| `composables/useLabelColor.ts` → `labelStyle()` (colorjs.io oklch) | utils·color (`labelStyle`, `parseColor`, `getHsla`) | ✅ | Same oklch light/dark label-chip derivation; catalog `labelStyle` supersedes it. |
| `display/Label.vue` | Display·DisplayLabel | ✅ | Colored pill backed by `labelStyle` — direct match. |
| `composables/useRelativeTime.ts` (`formatRelative`/`formatAbsolute`) | format·`formatTimeAgo` / `formatDateTime` | ✅ | Duplicated humanizers now in catalog `utils/format`. |
| floating-vue dropdowns (`DetailComposer`/`DetailReactions`/`DetailMergeWidget`/`DetailTemplatePicker`) + `panel/Detail.vue` reka menu | Overlay·OverlayDropdown(+Item) / OverlayTooltip | 🟡 | Catalog standardizes on reka-ui menus + floating-vue tooltips; ghfs's ad-hoc dropdowns could converge. |

### Not covered (gaps — stay app-local or need new components)
| Repo component / feature | What it does | Suggestion |
|---|---|---|
| `composables/useCommands.ts` + `useCommandHandler.ts` + `useCommandPalette.ts` + `panel/CommandPalette.vue` + `panel/Help.vue` | Full command registry: whenexpr-gated commands, sequence/chord keybinding dispatcher (`g g`, `mod+k`, tail-match buffer), fuzzy palette, auto-generated shortcuts help | **Deferred from @antfu/design v1** — keep app-local. The `Kbd`/keybinding *utils* it relies on are shipped, so only the registry + palette UI stay. Strongest candidate to upstream in a future version. |
| `display/Author.vue` + `ui/Avatar.vue` + `ui/SafeImage.vue` | GitHub avatar with login fallback / initials / `<img>` error handling | App/domain-specific (GH CDN URLs). No catalog equivalent; keep local (recurs in nmi → candidate `SafeImage`/`Avatar`). |
| `display/ProjectIcon.vue` + `composables/useProjectIcon.ts` | Repo icon with local-icon → GH-avatar → octicon fallback chain via RPC | Domain-specific; not a generic FileIcon. Note: catalog's `DisplayFileIcon` + `utils/icon` (`getFileType`/`getFileIcon`) covers *ext→icon* mapping, which ghfs does NOT currently have but would benefit from if it ever renders a real file tree. |
| `display/ActivitySparkline.vue` + `ItemActivitySparkline.vue` (vue-data-ui) | Inline commit/activity sparkline | Not in catalog (catalog has DisplayDonut/ProportionBar, not sparklines). Keep local. |
| `display/ItemStateIcon.vue` + `PrReviewDecision.vue` | GH issue/PR state → octicon + color | Domain-specific octicon mapping; keep local (uses catalog `badge-color-*` tokens). |
| `ui/ProgressToast.vue` + `useAppState` progress/error state | Multi-stage sync/execute progress toast (stage pipeline, % bar, counters) | Far richer than `FeedbackToasts`; keep the bespoke pipeline UI, but it could *consume* the controlled `FeedbackToasts` for the generic error fallback. |
| `panel/Detail*`, `item/Row.vue`, `panel/AppBar.vue`, markdown/diff/shiki composables (`useMarkdown`/`useShiki`/`useParsedDiff`) | Issue/PR detail, conversation timeline, diff/commit views, markdown+shiki rendering, the breadcrumb-ish AppBar | App-specific GitHub-browser surfaces. Not covered; these are the equivalent of ghfs's "file/code preview" — out of scope for the design system. |
| Form controls: raw `<input>` everywhere; no Switch/Checkbox/Select/RadioGroup components; dark toggle is a plain icon-swap `IconButton` | — | ghfs has **no** form-primitive components — adopting Form·FormSwitch/FormCheckbox/FormSelect/FormTextInput and Action·ActionDarkToggle (view-transition reveal) would be a net *gain*, not a migration. No Donut, FeedbackTip/Callout, or collapsible SectionBlock present either. |

### Setup & token alignment
- Very close fit. ghfs already brings its own base preset (`presetWind3`) + icons + web fonts + `@unocss/reset`, exactly the "composable, consumer-brings-base" contract of `presetAnthonyDesign`; migration = add the preset and delete the overlapping shortcuts block.
- **Theme options line up 1:1:** primary = its GitHub-blue ramp; dark near-black `#111`; named z-layers (`z-nav…z-drawer-content`) are literally the scheme the preset unifies — ghfs would drop its local copy. Its bespoke `date-chip-*` and `btn-toggle-pill*` shortcuts map onto catalog severity/`btn` tokens.
- **State/reset caveats (stateless package):** ghfs is already stateless-friendly — dark via `useDark()`, no global toast store (per-call `state.setError`/`setProgress`), clipboard inline via `navigator.clipboard`. Two mismatches: (1) `LayoutSplitPane` persists pane size through **VueUse localStorage**, whereas ghfs persists `listPaneSize` server-side via RPC (`useUiState`) — keep ghfs's persistence, use the component shell only; (2) `Label`/`DateBadge` read `useDark()` internally, while catalog scheme-varying components take a `colorScheme` **prop** — wire `isDark` through on adoption.
- **Command palette is deferred** but the supporting `Kbd`/keybinding utils, named z-layers, and `toTree`/color/format/path utils are shipped — so ghfs can replace `parseKey.ts`, `useLabelColor.labelStyle`, and `useRelativeTime` immediately while keeping the registry/palette local.

### Top wins
- Delete ~170 lines of `uno.config.ts` shortcuts (`btn-*`, `badge*`, `kbd`, `color-*`, `op-*`, `tab-*`, `date-chip-*`) and the named z-layer block in favor of the preset's tokens — single source of truth.
- Replace `ui/utils/parseKey.ts` and `useLabelColor.labelStyle()` / `useRelativeTime.ts` with `@antfu/design/utils` (keybinding, color, format) — exact-match dedupe.
- Adopt OverlayModal / FeedbackEmptyState / FormSearchField / ActionIconButton / DisplayKbd / LayoutExpandableList directly; they're already near-identical to ghfs's `ui/*` components.
- Upgrade `ui/Drawer.vue` to reka-ui-backed OverlayDrawer and wrap the raw reka Tabs in LayoutTabs — gains focus-trap/a11y and removes duplicated `tab-trigger` styling.
- Net-new capability for free: Form primitives (Switch/Checkbox/Select/RadioGroup/TextInput), ActionDarkToggle's view-transition reveal, and `DisplayFileIcon` + `utils/icon` ext→icon mapping if ghfs ever surfaces a literal file tree (`utils/tree.toTree` is available too).
- ghfs's command registry + palette + `Help.vue` stay app-local (deferred), so migration is low-risk: it's additive token/util/component adoption, not a rewrite of its keyboard-driven core.

---

## 5. vite-plugin-inspect

**Repo:** https://github.com/antfu-collective/vite-plugin-inspect · `src/client`
**Stack:** UnoCSS base = `presetUno` (Wind3-era) + `presetAttributify` + `transformerDirectives`/`VariantGroup` · primary = teal (`hover:text-teal-600`, `bg-teal5`) · fonts = `presetWebFonts` DM Sans / DM Mono (local processor) · dark = VueUse `useDark` + custom `bg-main: #121212` near-black · overlays = floating-vue (Dropdown + `v-tooltip`), splitpanes (`splitpanes.d.ts` present; used in `module.vue` + `DiffEditor.vue`), no reka-ui · icons = `presetIcons` with carbon (UI), catppuccin (file types), ic (graph shapes)
**Migration verdict:** High alignment, medium effort — this is essentially the prototype @antfu/design was distilled from (same color/path/plugin-name/badge primitives, same floating-vue + splitpanes + VueUse + DM fonts stack). Biggest win is deleting hand-rolled color/format/path utils and the Badge/PluginName/ModuleId/FilepathItem cluster. Requires a base-preset migration from `presetUno`/Wind3 to a current Wind3/Wind4 base, and re-pointing the local `border-main`/`bg-main`/`status-*`/`icon-btn` shortcuts at preset tokens.

### Covered — how it benefits (repo → @antfu/design)
| Repo component / util | @antfu/design equivalent | Coverage | Benefit / migration note |
|---|---|---|---|
| `logic/color.ts` (`getHashColorFromString`, `getHsla`, `getPluginColor` + `predefinedColorMap`) | utils `color` (`getHashColorFromString`, `getHsla`, `getPluginColor`, `defaultBrandHues`) | ✅ | Near-identical API; delete the file and import from `@antfu/design/utils`. App's `predefinedColorMap` (error/ssr/vite/virtual hues) maps to `defaultBrandHues` — confirm/extend the brand-hue set. |
| `Badge.vue` (hash/hue pill, polymorphic `as`, `:color` boolean/number) | `DisplayBadge` + `badge`/`badge-color-<name>` recipe | 🟡 | Covers the pill; verify the polymorphic `as="button"` + `:color={boolean\|number}` API (used as a toggle in `SegmentControl`/`RadioGroup`) survives. The number-hue path overlaps `getHsla`. |
| `PluginName.vue` (strips `vite-plugin-`/`rollup-`/`unplugin-`, dims prefix, `scope:` hash color) | `DisplayPackageName` (`stripPluginPrefix`/`stripModuleQuery`, scoped hash color) + util `stripPluginPrefix` | 🟡 | Same intent. App also handles `vite:`-namespace `compact` mode and `__load__` — check those prefixes are in `defaultFileIconRules`/strip rules or pass a custom list. |
| `ModuleId.vue` (relative path, segment dimming, `.pnpm`→`…`, `:` plugin-color, virtual badge, file icon, tooltip) | `DisplayFilePath` (truncated mono, segment dimming, `.pnpm`→`~`, scope color, icon, link) | 🟡 | Strong match — this is the most valuable swap. Differences: app collapses `.pnpm` to `…` (preset uses `~`), colors query strings orange, and wraps in `v-tooltip`; would move to `OverlayTooltip`. Uses `pathe.relative` → preset's `relativeModulePath`/`parseReadablePath`. |
| `FilepathItem.vue` (bold base + dimmed dir, `:line:col`, open-in-editor) | `DisplayFilePath` (segment dimming, link) | 🟡 | Display covered; the `/__open-in-editor` fetch is app behavior — keep as a click handler / `@click`, pass via slot or link prop. |
| `FileIcon.vue` (ext→catppuccin map, node_modules folder, light-mode invert filter) | `DisplayFileIcon` + util `getFileIcon`/`getFileType`/`defaultFileIconRules` | ✅ | Configurable map replaces the inline `Record`. Set the catppuccin map via theme `FileIcon` option. Light-mode `invert/hue-rotate` hack may be obviated by preset's scheme handling — verify. |
| `DurationDisplay.vue` (ms/s/min + `status-red/yellow/green` thresholds) | `DisplayDuration` (ms/ns→human + severity) + util `formatDuration`/`getDurationColor` | ✅ | Direct replacement incl. severity coloring; the `factor` prop and `status-*` classes map to preset `color-scale-*`/`mapSeverity`. |
| `ByteSizeDisplay.vue` (B/KB/MB/GB) | `DisplayBytes` + util `formatBytes`/`getBytesColor` | ✅ | Direct replacement; gains severity + %-of-total for free. (`ModuleList` already colors dist vs source size manually — preset's `getBytesColor` covers it.) |
| `NumberWithUnit.vue` (number + dimmed unit) | `DisplayNumber` (Intl mono tabular) / internal of Bytes/Duration | 🟡 | Tiny primitive; becomes redundant once Bytes/Duration come from preset. `DisplayNumber` adds tabular Intl formatting. |
| `SegmentControl.vue` (bordered pill group, built on Badge) | `LayoutSegmentControl` / `LayoutTabs` (reka-ui) | 🟡 | Preset version is reka-ui-backed (a11y roving focus) vs the app's button group; behavior matches (`QuerySelector`, `metric.vue` use it). Migration swaps Badge-buttons for the reka primitive. |
| `RadioGroup.vue` (native radios + labels) | `FormRadioGroup` (reka-ui) | ✅ | Direct replacement (used in `Graph.vue` weight selector). |
| `SearchBox.vue` (text input + checkboxes) | `FormSearchField` (input+icon+Kbd+clear) + `FormCheckbox` | 🟡 | The text field maps to `FormSearchField` (gains search icon/clear/Kbd); the four filter checkboxes map to `FormCheckbox`. Store binding (`options.search.*`) stays app-side. |
| `NavBar` dark toggle (`toggleDark`, carbon sun/moon) | `ActionDarkToggle` (controlled, view-transition reveal) | 🟡 | Replaces the manual `<button @click="toggleDark()">`; preset is stateless/controlled so wire it to the app's existing `useDark` ref. |
| `icon-btn` shortcut + NavBar GitHub/action buttons | `ActionIconButton` (round op-fade + tooltip + active) / `btn-icon` token | 🟡 | The repo's `icon-btn` shortcut is essentially `btn-icon`; the many NavBar/module-toolbar buttons become `ActionIconButton` with tooltips. |
| `ModuleList.vue` empty state ("No module recorded…") + `module.vue` "No transform data" | `FeedbackEmptyState` | 🟡 | Repeated ad-hoc empty blocks consolidate into one component. |
| `App.vue` "Loading…" Suspense fallback | `FeedbackLoading` / `FeedbackSpinner` | 🟡 | Replace the bare string fallback. |
| `module.vue` / `DiffEditor.vue` `Splitpanes`+`Pane` (persisted `panelSizeModule`/`panelSizeDiff` via Pinia/localStorage) | `LayoutSplitPane` (splitpanes, persisted) | ✅ | Same library; preset wraps persistence + global CSS theming. The repo already persists sizes manually, so this is a clean consolidation (note `splitpanes.d.ts` shim can likely be dropped if preset ships types). |
| `module.vue` floating-vue `Dropdown` (deps/importers popovers) | `OverlayDropdown` + `OverlayDropdownItem` (or `OverlayTooltip`) | 🟡 | Preset standardizes on reka-ui dropdowns + floating-vue tooltips; app uses floating-vue `Dropdown`. Either keep floating-vue Dropdown (themed by preset CSS) or migrate to `OverlayDropdown`. |
| `logic/utils.ts` `safeJsonParse`, `msToTime` | utils `safeJsonParse`; `formatDuration` | ✅ | `safeJsonParse` is 1:1; `msToTime` duplicates `formatDuration`. |
| ad-hoc `text-truncate`/`text-sm font-mono`/`op50`/`op75` usage | type tokens `text-micro/mini/compact`, `op-fade/op-mute`, `color-muted/faint` | 🟡 | Wholesale token alignment opportunity; the repo hardcodes opacities/sizes that preset names. |

### Not covered (gaps — stay app-local or need new components)
| Repo component / feature | What it does | Suggestion |
|---|---|---|
| `DiffEditor.vue` | CodeMirror dual-pane editor + worker-computed inline/line diff (`diff-match-patch-es`), scroll-sync, line-wrapping, JS/CSS/HTML mode guessing | Stay app-local. Code/diff viewers are explicitly OUT of @antfu/design v1. Only the surrounding `LayoutSplitPane` is covered. |
| `logic/codemirror.ts` + `styles/cm.css` + `guessMode` | CodeMirror setup, modes, scroll-sync helpers, `codemirror-theme-vars` | App-local; no preset equivalent (v1 has no CodeBlock/editor). |
| `Graph.vue` | vis-network force-directed module dependency graph (node shapes/colors, weight modes, click-to-route, legend) | App-specific; no graph primitive in catalog. Its inline ext→color map could borrow `getPluginColor`, but the graph itself stays. |
| `PluginChart.vue` / `ServerChart.vue` / `metric.vue` | ECharts bar charts (per-plugin transform/resolveId timings, server middleware metrics) over RPC | App-specific metrics dashboards; not covered (`DisplayDonut`/`DisplayProportionBar` are simple SVG, not charting). |
| Transform-stack panel (`module.vue` left pane) | Per-plugin transform step list with bailout/no-change/load/order/error badges, current-step highlight | App-specific composite; reuses `DisplayBadge`/`DisplayDuration`/`PluginName` but the stack UI itself stays local. (`LayoutExpandableList` is the nearest shell.) |
| `ErrorDisplay.vue` | Parsed error message + stack-frame grid w/ open-in-editor links | App-local; `FeedbackTip`/`Callout` is for short notices, not stack traces. Reuses `FilepathItem`→`DisplayFilePath`. |
| `logic/rpc.ts`, `logic/hot.ts`, `stores/*`, `worker/diff` | Comlink RPC, HMR wiring, Pinia payload/options/search stores, Fuse.js search | App infrastructure; out of scope (preset is stateless/UI-only by design). |
| `inspectSourcemaps` (`logic/utils.ts`) | Serializes code+map to base64 and opens evanw source-map-visualizer | App-specific utility; no equivalent. |

### Setup & token alignment
- **Very close stack fit.** The repo already uses the exact overlay/state libraries @antfu/design themes around: floating-vue, splitpanes (+ `splitpanes.d.ts`), VueUse `useDark`, Pinia, DM Sans/DM Mono. Adoption is mostly "delete local copy, import from preset."
- **Base-preset migration required.** `uno.config.ts` uses `presetUno()` (the legacy Wind3 alias) + `presetAttributify`. `presetAnthonyDesign` is composable and expects the consumer to bring a current base (Wind3 or Wind4) + `presetIcons` + `presetWebFonts` + `@unocss/reset`. The repo already brings icons/fonts/reset (`@unocss/reset/tailwind.css`), so the work is swapping `presetUno` for the supported base and adding `presetAnthonyDesign`.
- **Re-point local shortcuts to tokens.** `border-main`/`border-subtle`→`border-base`/`border-mute`; `bg-main`/`bg-active`/`bg-subtle`→`bg-base`/`bg-active`/`bg-secondary`; `text-main`→`color-base`; `icon-btn`→`btn-icon`/`ActionIconButton`; `status-green/yellow/red/lime`→`color-scale-*`/`mapSeverity`. Set theme `primary` to teal to match the existing `teal-600`/`teal5` accent, and the `dark near-black` option to `#121212`.
- **State/reset caveats.** Preset owns no dark/toast/clipboard state — fine here since the app already centralizes `isDark` in `logic/dark.ts` (wire it into `ActionDarkToggle` controlled prop) and has no toasts. Components like `Badge`/`ModuleId` currently read `isDark` internally via `getHsla`; preset's scheme-varying components take a `colorScheme` prop instead, so those reads move to props.
- **CodeBlock/DiffView out of scope.** The transform diff viewer (CodeMirror) and code rendering are explicitly excluded from v1 and must remain app-local; only their surrounding `LayoutSplitPane` shell is covered.

### Top wins
- Delete `logic/color.ts` and the duplicated format/path helpers (`msToTime`, byte/duration formatting, `pathe.relative` munging, `safeJsonParse`) in favor of `@antfu/design/utils` — the single largest LOC reduction and the cleanest 1:1 match.
- Replace the `Badge` / `PluginName` / `ModuleId` / `FilepathItem` / `FileIcon` cluster with `DisplayBadge` / `DisplayPackageName` / `DisplayFilePath` / `DisplayFileIcon`, gaining tested `.pnpm` collapsing, scope coloring, and a configurable icon map.
- Swap the bespoke `Duration`/`ByteSize`/`NumberWithUnit` trio for `DisplayDuration`/`DisplayBytes`/`DisplayNumber`, picking up severity coloring and %-of-total (which `ModuleList` currently re-implements by hand).
- Adopt `presetAnthonyDesign` tokens for the local `border-*`/`bg-*`/`status-*`/`icon-btn` shortcuts and ad-hoc `op50`/`text-sm font-mono` usage, unifying the near-black dark theme and teal accent under named tokens.
- Standardize the heavily-used floating-vue tooltips/dropdowns and the persisted splitpanes layout via `OverlayTooltip`/`OverlayDropdown`/`LayoutSplitPane`, and consolidate the repeated empty/loading blocks into `FeedbackEmptyState`/`FeedbackLoading`.
- Move dark-mode toggling to the controlled `ActionDarkToggle` (view-transition reveal) wired to the existing `useDark` ref, and form inputs to `FormSearchField`/`FormCheckbox`/`FormRadioGroup`/`LayoutSegmentControl` for free a11y — while keeping the genuinely app-specific Inspect surfaces (CodeMirror diff viewer, vis-network graph, ECharts metrics, transform-stack panel, RPC/HMR/stores) exactly where they are.

---

## 6. unocss — inspector (@unocss/inspector)

**Repo:** https://github.com/unocss/unocss/tree/main/packages-integrations/inspector · `client/`
**Stack:** UnoCSS base = `presetUno` (Wind3-era) + `presetAttributify` · primary = `teal` (hardcoded `text-teal5`/`bg-teal5:10`, no token) · fonts = `Inter` + `Fira Code` (Google Fonts link in `index.html`) · dark = `useDark()` class + `dark:` variants, near-black `#080808` · overlays = `floating-vue` (Dropdown) · icons = `presetIcons` (carbon + vscode-icons)
**Migration verdict:** High alignment, low-to-moderate effort. The inspector already lives in the preset's exact stack (UnoCSS, splitpanes, floating-vue, VueUse-owned state, full-path component imports), so the chrome (panes, tabs, dark toggle, dropdown, file icons, tree) maps almost 1:1. It has NO token layer — colors/borders are ad-hoc (`border-main`, `bg-active` shortcuts; hardcoded `text-teal/amber/blue`) — so the main work is adopting preset tokens, not unwinding an existing one. `theme.ts` is a CodeMirror highlight theme, unrelated to design tokens. The core editor/analysis surface stays app-local.

### Covered — how it benefits (repo → @antfu/design)
| Repo component / util | @antfu/design equivalent | Coverage | Benefit / migration note |
|---|---|---|---|
| `NarBar.vue` dark toggle (view-transition circle reveal, `useDark`) | `ActionDarkToggle` | ✅ | Near-identical implementation (the same VitePress/@hooray reveal). Drop the inline copy; pass `colorScheme` controlled. |
| `Tabs.vue` + `OverviewTabs.vue` (`v-model`, items w/ icon+label, `bg-active` selected) | `LayoutTabs` / `SegmentControl` (reka-ui) | ✅ | Replace the hand-rolled `<ul>`; gain a11y roving-tabindex from reka-ui. |
| `App.vue`, `ModuleInfo.vue`, `repl.vue` resizable `Splitpanes`/`Pane` + `main.css` splitter styling | `LayoutSplitPane` (splitpanes, persisted) | ✅ | Same lib. Preset themes the splitter globally, so the `.splitpanes__splitter` block in `main.css` can be deleted; also gains size persistence. |
| `AnalyzerItem.vue` floating-vue `Dropdown` (#popper with copy/docs/modules) + `main.css` `v-popper--theme-dropdown` light/dark overrides | `OverlayDropdown` / `OverlayTooltip` (floating-vue) | ✅ | Same lib. The hand-written light/dark popper CSS in `main.css` is exactly what the preset's global override replaces. |
| `FileIcon.vue` (ext→`i-vscode-icons-*` switch) | `DisplayFileIcon` (themeable FileIcon map) | ✅ | Identical concept; replace local switch with the configurable map. |
| `ModuleId.vue` (root-relative truncated path, `op80` leading dot) | `DisplayFilePath` (truncated mono path) | ✅ | Direct match. |
| `Copy.vue` (renderless `useClipboard` slot) | (covered by stateless clipboard pattern; used by `FeedbackToasts`/dropdown) | 🟡 | The preset doesn't own clipboard state by design; `Copy.vue` is the same VueUse pattern and can stay, or fold into dropdown items. |
| `ModuleTreeNode.vue` recursive `<details>` tree of `RouterLink`s | `LayoutExpandableList` (+ tree shape) | 🟡 | Visual/disclosure container maps; the module-routing leaf stays app-specific. |
| `toTree()` in `composables/fetch.ts` (path-split + single-child flatten) | `utils/tree.toTree` | ✅ | Replace local impl with the shared util (same flatten behavior). |
| gzip size `((x)/1024).toFixed(2) KiB` in `ModuleInfo.vue` + `Overview.vue` (x2) | `utils/format.formatBytes` + `getBytesColor` / `DisplayBytes` | 🟡 | Swap the 3 inline `KiB` calculations for `formatBytes`; optionally color by size. |
| `StatusBar.vue` (`bg-active`, `border-b main`) info strip | preset tokens `bg-secondary`/`border-base` (+ `LayoutSectionBlock`) | 🟡 | Re-skin with tokens; not a 1:1 component but absorbed by the token system. |
| `<sup>{{ count }}</sup>` usage badges (AnalyzerItem, Analyzer headers) | `DisplayNumberBadge` / `DisplayBadge` | 🟡 | Counts/`beta` tag → badge tokens (`badge`, `badge-color-<name>`). |
| Inline `<input type=checkbox>` (Prettify, Merge Alias, Include safelist) in `ModuleInfo`/`Overview`/`Analyzer`/`repl` | `FormCheckbox` (and `FormSwitch`) | ✅ | 4 raw checkboxes → consistent styled control. |
| `border-main`/`bg-active` shortcuts + scattered `op50/op60/op80`, `text-gray5 dark:gray3` | preset tokens `border-base`, `bg-active/hover`, `op-fade/op-mute`, `color-muted/faint` | ✅ | The biggest single win: replace ad-hoc opacity/gray/border classes with semantic tokens; delete the two `uno.config.ts` shortcuts. |

### Not covered (gaps — stay app-local or need new components)
| Repo component / feature | What it does | Suggestion |
|---|---|---|
| `CodeMirror.vue` + `composables/codemirror.ts` + `theme.ts` (vitesse) | CodeMirror 6 editor: matched-position marks, autocomplete, read-only, per-mode lang, `--cm-*` light/dark vars | Stay app-local. Out of catalog scope; only align the `--cm-*` palette with preset bg/border tokens. |
| `Analyzer.vue` | Utilities analyzer: alias-merge, top-10, color palette swatches, icon set, `vue-flow-layout` category masonry | App-specific. `AnalyzerItem` chrome (dropdown/badge) is covered; the analysis logic/layout is not. |
| `Overview.vue` stat dashboard | Presets/rules/variants/shortcuts/layers/size grid with per-category accent colors + clickable layer→CSS | App-specific layout. Could use `DisplayNumber`/`formatBytes`/tokens, but the panel itself is bespoke. |
| `src/categories.ts` + `src/utils.ts` (`getSelectorCategory`, `intersect`, `getIntersections`) | UnoCSS utility→category map and shortcut-suggestion intersection logic | Stays in `src/`. Domain logic, no catalog equivalent (the preset's color/format utils don't overlap). |
| `composables/usePrettify.ts` | Prettier-in-browser CSS/HTML/JS formatting | App-local; not a design concern. |
| `composables/fetch.ts` / `hmr.ts` | UnoCSS dev-server API fetch + HMR config/module events | App-local data layer. |
| `composables/useScrollStyle.ts` + `.scrolls*` CSS | `calc(100vh - …)` scroll-height plumbing for CodeMirror panes | App-local; tied to the editor layout. |
| `ReplPlayground.vue` / `repl.vue` | Two-pane live REPL (input HTML ↔ generated CSS) | App-specific; built from covered pieces (`LayoutSplitPane`, `FormSwitch`, `StatusBar`) but the REPL itself is bespoke. |
| Sidebar `RouterLink` nav + module tree | Routed file navigation | App-specific routing; only the tree disclosure visuals are covered. |

### Setup & token alignment
- **Closeness:** Very close. The inspector is effectively a reference consumer of the preset's stack — UnoCSS + splitpanes + floating-vue + VueUse-owned dark/clipboard/storage state + Components-auto-import-by-path. The stateless philosophy already holds (`useDark`, `useClipboard`, `useLocalStorage`/`useStorage` in `repl.vue`), so no state needs unwinding.
- **Its theme.ts vs preset tokens:** `client/theme.ts` is a CodeMirror `HighlightStyle`/`EditorView.theme` (vitesse), NOT a design-token layer — it does not map to preset tokens and should be left as-is (at most, point its `--cm-background`/`--cm-border` at preset bg/border tokens for visual cohesion). There is otherwise **no token layer at all**: the only abstractions are two `uno.config.ts` shortcuts (`border-main` → `border-gray:20`, `bg-active` → `bg-gray:8`) plus ad-hoc `op-*`/`text-gray*`/`text-teal/amber/blue` throughout. Migration replaces these with `border-base`/`bg-active`/`op-fade`/`color-muted`/`badge-color-*`.
- **Theme options:** Set preset `primary` = teal to preserve the accent; provide the `FileIcon` map (vue/ts/js/json/md/svelte/marko/html) from `FileIcon.vue`; keep dark near-black (`#080808` today vs preset's near-black). Fonts (Inter/Fira Code) already match the preset's font expectations — keep the Google Fonts link (consumer brings fonts).
- **Base-preset migration:** Currently `presetUno` (Wind3 era). The preset is composable and consumer-supplied, so this is the one real decision: either keep Wind3 or move to Wind4. Attributify is used heavily (`border="r main"`, `p="x4 y3"`, `text="sm gray5 dark:gray3"`) and `presetAttributify` must stay in the consumer config. The `@unocss/reset/tailwind.css` import already satisfies the "consumer brings reset" requirement.
- **State/reset caveats:** None blocking — reset, dark, clipboard, and persisted storage are all already in place and match the preset's expectations.

### Top wins
- **Delete hand-written global overrides:** the splitpanes splitter block and the light/dark `v-popper--theme-dropdown` block in `main.css` are exactly what `LayoutSplitPane` + `OverlayDropdown`/`OverlayTooltip` theme globally — pure deletion.
- **Token sweep:** replace the `border-main`/`bg-active` shortcuts and the pervasive `op50/op60/op80`, `text-gray5 dark:gray3`, hardcoded accent colors with semantic tokens (`border-base`, `bg-active/hover`, `op-fade/op-mute`, `color-muted/faint`, `badge-color-*`) — the largest consistency/maintainability gain.
- **Drop duplicated chrome:** `ActionDarkToggle` (the view-transition toggle is a verbatim re-implementation), `LayoutTabs` (replaces both `Tabs.vue` and the `<ul>` markup), and `LayoutSplitPane` (adds size persistence the inspector lacks).
- **Adopt shared utils:** `formatBytes` for the 3 inline `KiB` calculations, `utils/tree.toTree` for the local `toTree`, and `FormCheckbox`/`FormSwitch` for the 4 raw `<input type=checkbox>` controls.
- **FileIcon + DisplayFilePath:** swap `FileIcon.vue`'s switch and `ModuleId.vue` for the configurable `DisplayFileIcon` map and `DisplayFilePath`.
- **Out of scope (correctly):** the CodeMirror editor/theme, the utilities Analyzer, the Overview dashboard, the REPL, and the `src/` category/intersection logic remain app-local — these are the inspector's reason to exist and have no catalog equivalent.

---

## 7. unocss — interactive

**Repo:** https://github.com/unocss/unocss/tree/main/interactive
**Stack:** UnoCSS base = `presetWind3 + presetAttributify` · primary = `cyan` (`btn`=cyan6/7, `link` hover cyan6) · fonts = `Inter` (sans) / `IBM Plex Mono` (mono) via presetWebFonts · dark = `useDark()` class strategy, near-black `#121212` · overlays = none from a lib — hand-rolled `Modal.vue` (mobile drawer) + `RecycleScroller` (`vue-virtual-scroller`); no floating-vue/reka-ui/splitpanes · icons = `presetIcons` (Carbon set, scale 1.2)
**Migration verdict:** Medium benefit, low–medium effort, good alignment — the chrome (dark toggle, search field, badges, virtual list, modal/drawer, copy button, empty/loading/tip states) maps cleanly onto the catalog, but the entire search-engine core (rule/variant/shortcut explorer, MDN/caniuse cards, live config editor, color-palette table) is app-specific and stays local. Off-default theme: set theme options to `primary: cyan`, fonts `Inter`/`IBM Plex Mono`, dark near-black `#121212`, and a Carbon FileIcon/icon map.

### Covered — how it benefits (repo → @antfu/design)
| Repo component / util | @antfu/design equivalent | Coverage | Benefit / migration note |
|---|---|---|---|
| `DarkToggle.vue` (view-transition circle reveal, reduced-motion guard) | `ActionDarkToggle` | ✅ | Catalog component is the controlled, view-transition dark toggle — drop-in. Pass `colorScheme`/toggle; app keeps owning `useDark()` state (catalog is stateless). |
| Search `<input>` block (border-rounded shell, clear-X button, focus, type-to-search) | `FormSearchField` (input + search icon + Kbd + clear) | 🟡 | Replaces the bespoke input + absolute clear button and gives a shortcut Kbd affordance. App must keep the `RecycleScroller` results + arrow/Enter/Escape keyboard nav wiring around it. |
| `Modal.vue` (direction bottom/top/left/right, mask, slide transform — used as mobile drawer) | `OverlayDrawer` (+ `OverlayModal`) | 🟡 | Catalog drawer covers the directional slide-in + mask; `v-model` open state stays app-owned. Desktop side-panel layout (the `grid lg:cols-2`) is not a drawer — leave as layout. |
| `ResultItem.vue` / `item/Base.vue` square type badges (`badge-square-*` S/V/T/D/M/C/G letter pills, active/hover row) | `DisplayBadge` + `badge-color-<name>` tokens; row active/hover via `bg-active`/`op-fade` tokens | 🟡 | Letter-in-a-square category markers map to `DisplayBadge` + per-name badge color tokens; replaces the local `badge-square-*` shortcut regex in `uno.config.ts`. Custom row geometry (4px left accent border tinted by rule color) stays local. |
| Virtualized results list (`RecycleScroller`, `page-mode`, variable `size`/compact `item-size`) | `LayoutVirtualList` (`@tanstack/vue-virtual`) | 🟡 | Swaps `vue-virtual-scroller` for the catalog's TanStack-based virtual list; needs variable-height support for the 44/56/80px row sizes + a `scrollToItem` equivalent for keyboard selection. |
| Compact/normal density toggle in `TheNav` (`isCompact`, list vs list-boxes icon button) | `ActionIconButton` (round, tooltip, `active` state) | ✅ | The icon toggle buttons (compact, settings/close, docs/playground/GitHub links) are exactly `ActionIconButton` (icon + title→tooltip + active); polymorphic `href` covers the external links. |
| Nav external link/icon buttons + `btn` (cyan) buttons in Config/Search ("Save", "Cancel", "Clear search", "Reset to default") | `ActionButton` (btn-action/btn-primary recipe, `to`/`href`, `loading`, `disabled`) | ✅ | Replaces the local `btn` shortcut; primary = cyan via theme. Disabled/`pointer-events-none` Save state maps to `disabled`/`loading` props. |
| `details/Base.vue` copy-title button (`useClipboard`, copy→checkmark swap) | `ActionIconButton` (controlled `copied` state) + clipboard via VueUse | ✅ | Catalog is stateless re: clipboard (app keeps `useClipboard`); the icon-swap copy affordance is the standard `ActionIconButton` pattern. |
| `PresetLabel.vue` (npm package link or fallback span) | `DisplayPackageName` | 🟡 | Renders a package name linking to npmjs; catalog `DisplayPackageName` covers the styled package-name display. Fallback-string branch is trivial to keep. |
| "Searching…" / "loading config…" spinners (`i-carbon-circle-dash animate-spin`), `animate-pulse` guide loader | `FeedbackSpinner` / `FeedbackLoading` | ✅ | Repeated spinner+label and pulse-loading blocks consolidate into the feedback components. |
| "No result found" block (italic op40 + Clear button) | `FeedbackEmptyState` | ✅ | Direct fit — empty state with message + action slot. |
| Config status banners (amber "loading", red error `<pre>`, green "N presets loaded") | `FeedbackTip`/`Callout` (+ `mapSeverity` / `color-scale-*` tokens) | 🟡 | The three severity banners map to a callout/tip with severity coloring; the embedded CodeMirror error stack stays as-is. |
| `Summary.vue` stat grid (Presets/Rules/Shortcuts/Variants/Search counts) | `DisplayNumber` / `DisplayLabel` | 🟡 | Each count→label pair is `DisplayNumber` + `DisplayLabel`; the 2-col grid layout stays local. |
| `Intro.vue` example-utility chips (`badge-lg-*` RouterLinks) | `DisplayBadge` + `badge-color-<name>` | 🟡 | The colored example chips are badges; hover-translate is local flavor. |
| `TheNav` version string `v{{ info.version }}` | `DisplayVersion` | 🟡 | Minor — styled version display. |
| `code` snippets in `ResultItem`/`Rule` (`.class`, `{ body }`) | `DisplayBadge` (hash/token pill) / type tokens `text-micro`/`text-mini` | 🟡 | Inline class/token display; the syntax-highlighted CSS blocks are Shiki and stay app-local. |
| `isMobile`/`isDesktop` via `useBreakpoints(breakpointsTailwind)`, `useLocalStorage`, `useToggle` | (VueUse — catalog explicitly defers state to VueUse) | ✅ | Already aligned with the catalog's stateless philosophy; no change needed. |

### Not covered (gaps — stay app-local or need new components)
| Repo component / feature | What it does | Suggestion |
|---|---|---|
| The search/explorer engine (`searcher`, `createSearch`, Fuse.js, `mapSearch`, arrow/Enter/Escape nav, `executeSearch` debounce, URL `?s=` sync) | Type-to-explore atomic-utility search-as-you-type with keyboard navigation and result grid | App core — keep local. Catalog `FormSearchField` + `LayoutVirtualList` only supply the shell. |
| `details/Rule.vue` rule explorer (variant-chain steps, static/dynamic rule rows, layers, regex→Regex101/Regexper/GitHub links, alias/same-rule lists) | Deep breakdown of how a UnoCSS utility resolves | Domain-specific — keep local. Uses catalog `DisplayBadge`/`ActionButton` for sub-bits only. |
| Live CSS preview (`highlightCSS`/`highlightJS` via Shiki + vitesse themes) | Renders generated CSS / JS-rule source with syntax highlighting | Keep local — Shiki is outside the design-system scope. |
| `Config.vue` live config editor (async CodeMirror, `evaluateUserConfig`, AMA, validate→save to localStorage) | Edit/evaluate a custom UnoCSS config in-browser | Keep local — CodeMirror editor + UnoCSS evaluation are app-specific. |
| `ColorsTable.vue` / `ColorsItem.vue` | Recursive theme color-palette swatch table generated from the live config | Keep local. Catalog color utils (`parseColor`, `getHsla`) could assist labels, but the recursive swatch grid has no catalog component. |
| `details/Rule.vue` color-contrast preview (A on color / color on white+black 4-cell swatch) | Shows a utility's color over light/dark backgrounds | Keep local; catalog `contrast` util could power a future a11y badge, but the swatch UI itself isn't covered. |
| `details/Doc.vue` MDN / Can-I-Use doc cards + "Relatives" | External-docs result cards with derived caniuse link | Keep local — card uses `ResultItem`/`DisplayBadge` internally but the MDN/caniuse domain content is app-specific. |
| `Intro.vue` brand SVG logomark + footer | UnoCSS logo + build/license credits | Keep local — brand asset. |
| Global `div{flex-direction:column}` / `div[row]` reset in `app.vue` | App-wide flex default override | Keep local; note it conflicts with the catalog's reset expectations — review during migration (see caveats). |

### Setup & token alignment
- **Closeness:** High in spirit — both are composable UnoCSS presets layered on a base (here Wind3 + Attributify) with Carbon icons, web fonts, dark-class strategy, and VueUse-owned state. `presetAnthonyDesign` slots alongside the existing `presetWind3()`/`presetAttributify()` rather than replacing them.
- **Theme options to set:** `primary: cyan` (replaces the local `btn`/`link` cyan6 shortcuts); fonts `sans: Inter`, `mono: IBM Plex Mono`; dark near-black `#121212`; a Carbon-based icon/FileIcon map. Replace local `uno.config.ts` shortcuts (`badge-*`, `badge-square-*`, `btn`, `link`, `bg-main`, `border-main`, `divider`) with catalog tokens (`badge-color-*`, `btn-primary`/`btn-action`, `bg-base`, `border-base`, etc.).
- **State/reset caveats:** (1) App owns all state (`useDark`, `useLocalStorage`, `useToggle`) — matches the catalog's stateless design; no toast/clipboard state to hand over (clipboard stays VueUse). (2) The global `div{display:flex;flex-direction:column}` reset in `app.vue` plus heavy Attributify usage (`row`, `border="~ rounded main"`) is a non-standard baseline that may clash with catalog component internals — audit component-by-component. (3) App uses `@unocss/reset/tailwind.css`; confirm it matches the catalog's expected reset. (4) Off-default `primary=cyan` + Inter/IBM Plex means the design study's defaults must be overridden via theme options, not assumed.

### Top wins
- Delete the hand-rolled `DarkToggle.vue` (view-transition + reduced-motion logic) in favor of `ActionDarkToggle` — identical behavior, less code to maintain.
- Standardize every icon button in `TheNav` (compact toggle, settings/close, docs/playground/GitHub) and the copy button in `details/Base.vue` onto `ActionIconButton` (icon + tooltip + active/copied state).
- Replace the local `btn`/`link`/`badge-*`/`badge-square-*` shortcut zoo in `uno.config.ts` with catalog `ActionButton` + `DisplayBadge` + badge-color tokens, themed to cyan — removes bespoke recipe maintenance.
- Consolidate the scattered spinner/pulse/empty/error/success blocks into `FeedbackSpinner`/`FeedbackLoading`/`FeedbackEmptyState`/`FeedbackTip`, with config banners driven by `mapSeverity`/`color-scale-*`.
- Swap the search input shell for `FormSearchField` and migrate `vue-virtual-scroller` → `LayoutVirtualList`, while keeping the app's own search engine, keyboard nav, and `?s=` URL sync.
- Adopt `Modal.vue` → `OverlayDrawer` for the mobile detail view, keeping `v-model` open state app-side per the controlled-overlay philosophy.

---

## 8. nuxt/devtools

**Repo:** https://github.com/nuxt/devtools · client `packages/devtools/client` · also `packages/devtools-ui-kit` = @nuxt/devtools-ui-kit (the coverage-checklist blueprint)
**Stack:** UnoCSS base = `presetWind3 + presetAttributify + presetTypography` · primary = `nuxt green (brand #00DC82 / primary #099e61)` · fonts = `DM Sans / DM Mono (+ Caveat "stylish" in client)` · dark = `near-black #151515` · overlays = `self-rolled (NDialog/NDrawer/NDropdown hand-built with @vueuse useFocusTrap + onClickOutside + Teleport/Transition, NOT reka-ui); panes = splitpanes; tooltips = floating-vue (VTooltip)` · icons = `presetIcons, mostly @iconify carbon (+ ri, logos, tabler, ph, simple-icons, bxl)` · theming = `n-/context-color via --nui-c-context (rejected by @antfu/design)`
**Migration verdict:** Highest-value but heaviest migration of the set — the ui-kit primitives map almost 1:1 onto @antfu/design's catalog (it was built as the checklist), but the work is real: the entire `n-`/`context`-color theming layer must be dropped (~52 client components pass `n="primary|red|green|…"`), self-rolled reka-less overlays swap to reka-ui, and the Nuxt-module auto-import distribution (`addComponentsDir`/`addImportsDir`) is replaced by full-path imports + a composable preset. App-specific DevTools panels (modules/components/routes/assets/timeline/terminal explorers) stay app-local.

### Covered — how it benefits (devtools-ui-kit / client → @antfu/design)
| Repo component / util | @antfu/design equivalent | Coverage | Benefit / migration note |
|---|---|---|---|
| `NButton.ts` (to/icon/border, btn recipe + n-context hover) | Action/ActionButton (btn-action recipe, polymorphic to/href, icon, variant, loading) | 🟡 | Gains variants + loading; lose imperative `n="color"` recoloring — map to `variant` + flat `*-base` tokens. |
| `NIcon.vue` icon-only button path / `n-icon-button` | Action/ActionIconButton (round op-fade + tooltip + active + #badge) | ✅ | Richer: built-in tooltip + active + badge slot. |
| `NDarkToggle.vue` (useColorMode storage + view-transition) | Action/ActionDarkToggle (controlled, view-transition reveal) | 🟡 | Same view-transition reveal, but @antfu/design is stateless/controlled — devtools owns `useColorMode('nuxt-devtools-color-mode')` and passes `colorScheme`. |
| `NBadge.vue` / `NBadgeHashed.vue` (hash→hsl color) | Display/DisplayBadge (hash/token pill) + util `getHashColorFromString` | ✅ | DisplayBadge + `getHashColorFromString` replace the local `getHslColorFromStringHash` composable. |
| `DurationDisplay.vue` + client `formatDuration` | Display/DisplayDuration + util `formatDuration`/`getDurationColor` | ✅ | Drop the bespoke `getLatencyColor`/`formatDuration`; @antfu/design ships both with severity coloring. |
| `FileIcon.vue` (ext→icon switch) | Display/DisplayFileIcon (configurable map) + util `getFileIcon`/`defaultFileIconRules` | ✅ | Replaces a 2-case switch with a configurable rule map. |
| `FilepathItem.vue` (parseReadablePath, mono, subpath dim, copy/open) | Display/DisplayFilePath (truncated mono path, segment dimming, scope color, icon, link) | ✅ | Direct fit; note copy/open-in-editor actions stay app-local (RPC). |
| client `parseReadablePath`/`getModuleNameFromPath`/`isPackageName`/`isNodeModulePath` (`composables/utils.ts`) | util `path` (`parseReadablePath`, `getModuleNameFromPath`, `isPackageName`, `isNodeModulePath`) | ✅ | **Byte-for-byte identical incl. the pathe#113 workaround** — pure dedupe, zero behavior change. |
| `ComponentName.vue` (`<Name/>` mono) / package-name rendering | Display/DisplayPackageName, DisplayLabel | 🟡 | Partial — `<Comp/>` bracket styling is bespoke; DisplayPackageName covers package-name cases. |
| `NCheckbox.vue` | Form/FormCheckbox | ✅ | Same; drops `n-checked:`/context classes for flat tokens. |
| `NRadio.vue` | Form/FormRadioGroup | 🟡 | @antfu/design is a grouped component; NRadio is a single input — wrap call sites. |
| `NTextInput.vue` (+ NNavbar search) | Form/FormTextInput, Form/FormSearchField | ✅ | Search variant gets a dedicated component. |
| `NSelect.vue` (native `<select>`) | Form/FormSelect (reka-ui) | 🟡 | Upgrade native select → reka-ui listbox (styling/a11y win, but markup differs — slot of `<option>`s becomes items). |
| `NSwitch.vue` | Form/FormSwitch | ✅ | Same. |
| `NSelectTabs.vue` (radio-fieldset segmented) | Layout/LayoutTabs (SegmentControl, reka-ui) | 🟡 | Functional match; reka-ui replaces the fieldset/radio hack. |
| `NCard.vue` (`n-card-base`) | Layout/LayoutCard | ✅ | Same. |
| `NSectionBlock.vue` (`<details>` collapsible) | Layout/LayoutSectionBlock (collapsible) | ✅ | Same role; @antfu/design provides controlled collapse. |
| `NSplitPane.vue` (splitpanes + localStorage persist) | Layout/LayoutSplitPane (splitpanes, persisted) | ✅ | Near-identical (both splitpanes + persisted) — strongest match; just retarget the storage key. |
| `NLoading.vue` (panel-grids + spin) | Feedback/FeedbackLoading + Feedback/FeedbackSpinner | ✅ | Covered; bg-dots/bg-grid tokens reproduce the panel grid. |
| `NTip.vue` | Feedback/FeedbackTip (Callout) | ✅ | Same; loses context recolor → use severity scale. |
| `NNotification.vue` (imperative singleton via `devtoolsUiShowNotification`) | Feedback/FeedbackToasts (controlled) | 🟡 | @antfu/design toasts are controlled/stateless — the global `devtoolsUiProvideNotificationFn` imperative API + `useCopy()`'s `devtoolsUiShowNotification('Copied')` must move to a VueUse-owned toast queue in the app. |
| `NDialog.vue` (Teleport + focus-trap + click-outside) | Overlay/OverlayModal (reka-ui Dialog, focus-trapped) | 🟡 | Behavior parity; swap hand-rolled focus-trap/glass for reka-ui Dialog. CommandPalette + ModuleActionDialog/RestartDialogs/AuthConfirmDialog rebuild on this. |
| `NDrawer.vue` (edge panel, transition sides) | Overlay/OverlayDrawer (reka-ui Dialog edge panel) | 🟡 | Covered; reka-ui replaces manual `useElementSize`/transition positioning. |
| `NDropdown.vue` (click-outside popover) | Overlay/OverlayDropdown + OverlayDropdownItem (reka-ui menu) | 🟡 | Upgrade to reka-ui menu (keyboard/focus a11y); items become OverlayDropdownItem. |
| floating-vue `VTooltip` (app-wide) | Overlay/OverlayTooltip (floating-vue) | ✅ | Same engine (floating-vue) — `VTooltip`/`#popper` usages map directly. |
| client `pluralizeByCount`, `getRequestMethodClass` (color map), `jsonStringifyCircular` | util `misc` (`pluralize`), `color` severity helpers, `safeJsonParse`/`stringifyUnquoted` | 🟡 | `pluralize` covers `pluralizeByCount`; method-color map and circular-JSON are app domain (keep local). |

### Not covered (gaps — stay app-local or need new components)
| Repo component / feature | What it does | Suggestion |
|---|---|---|
| `CommandPalette.vue` (Fuse.js fuzzy, ⌘K, keyboard nav, drill-in) | Full command palette | **No @antfu/design equivalent** — candidate new `Overlay/OverlayCommand`; meanwhile build on OverlayModal + FormSearchField + LayoutVirtualList. |
| `NCodeBlock.vue` / `CodeSnippets.vue` (Shiki via DevTools client) | Syntax-highlighted code | Out of scope (explicitly) — stays app-local; depends on DevTools' Shiki bridge. |
| `CodeDiff.vue` (diffLines + Shiki added/removed) | Code diff view | Out of scope (DiffView) — app-local. |
| `NMarkdown.vue` (renderMarkdown via client) | Markdown rendering | App-local — relies on DevTools renderer, no catalog entry. |
| `StateEditor.vue` (json-editor-vue) | Editable JSON tree | App-local — not a design-system concern. |
| `ComponentsGraph.vue` (vis-network) | Component dependency graph | App-local — domain visualization. |
| `TerminalView.vue` / `TerminalPage.vue` (xterm.js) | Embedded terminal | App-local. |
| Timeline suite (`TimelineView/Table/List/Segment/Item…`) | Perf/event timeline | App-local; rows can reuse DisplayDuration/DisplayBadge/DisplayProportionBar. |
| Module/Component/Route/Server-Route/Storage/Asset explorers (`ModuleItem*`, `ServerRouteDetails`, `RoutesTable`, `StorageDetails`, `Asset*`, `HooksTable`) | DevTools domain panels | App-local; benefit by composing Display/Layout primitives inside. |
| `NuxtLogo.vue`, `TabIcon.vue`, `SideNav*`, `DockingPanel`, `IframeView`, `SplitScreen`, `HelpFab`, `DisconnectIndicator`, `LaunchPage` | Nuxt-branded shell / chrome / launch & welcome screens | App-local branding & app chrome — not catalog material. |
| `NIconTitle.vue`, `NNavbar.vue`, `NPanelGrids.vue` | Icon+title row, sticky search navbar, grid background panel | Minor gaps — trivially recomposed from ActionButton/FormSearchField + bg-dots/bg-grid tokens (no 1:1 component). |
| `RestartDialogs`/`ModuleActionDialog`/`AuthConfirmDialog` + `createTemplatePromise` dialog flows | Promise-based confirm dialogs | Rebuild on OverlayModal; the promise-dialog orchestration stays app-local. |

### Blueprint note (@nuxt/devtools-ui-kit → @antfu/design)
- @antfu/design covers the ui-kit **primitive set almost completely** (it was the checklist): NButton, NIcon-button, NDarkToggle, NBadge/NBadgeHashed, NCard, NCheckbox, NRadio, NSwitch, NTextInput, NSelect, NSelectTabs, NSectionBlock, NSplitPane, NLoading, NTip, NDialog, NDrawer, NDropdown, NNotification all have equivalents.
- **Deliberately NOT adopted:** the `n-`/`context`-color theming mechanism (the `[/^n-(.*)$/]` rule, `--nui-c-context`, `n="primary|red|…"` attrs, `n-solid`/`n-dashed`/`n-disabled`/`n-checked:` variants) — replaced by flat semantic `*-base` tokens + a single primary; and the **Nuxt-module distribution** (`defineNuxtModule` + `addComponentsDir`/`addImportsDir` + bundled preflight/colorMode) — replaced by full-path category-prefixed imports and the composable `presetAnthonyDesign`.
- **ui-kit primitives with no @antfu/design equivalent:** `NCodeBlock`, `CodeDiff` (out of scope), `NMarkdown` (DevTools-renderer-bound), `NIconTitle`/`NNavbar`/`NPanelGrids` (trivial recompositions), and the client's `CommandPalette` (NCommand-style palette — a genuine gap worth a new Overlay component).

### Setup & token alignment
- **Close base** — both already share Wind3 + presetAttributify + presetTypography + presetIcons + DM Sans/DM Mono; the client even re-aliases `n-bg-base→bg-base`, `n-border-base→border-base` in its own `uno.config.ts`, so its call sites are already half-way onto the flat dialect.
- **Token migration:** `--nui-c-context`/`n="<color>"` → flat `color-base/muted/faint`, `bg-base/secondary/active/hover`, `border-base/mute/active`, `op-fade/op-mute`, `btn-action`/`btn-primary`/`btn-icon`, `badge*`. Per-element recoloring (52 components) collapses onto one primary + severity `color-scale-*`/`mapSeverity`.
- **Theme options:** set primary to nuxt green and dark to `#151515` to preserve the look; keep carbon as the FileIcon/default icon set; Caveat ("stylish") remains an app extra.
- **State/reset caveats:** @antfu/design owns no dark/clipboard/toast state — the app keeps `useColorMode`, `useClipboard`, and must convert the imperative `devtoolsUiShowNotification` singleton (used by `useCopy()`) into a controlled FeedbackToasts queue; consumer brings its own reset (preflight currently comes from the ui-kit module).
- **Out of scope:** CodeBlock/Shiki and DiffView stay app-local by design.

### Top wins
- **Pure utility dedupe, zero risk:** path utils (`parseReadablePath`/`getModuleNameFromPath`/`isPackageName`/`isNodeModulePath`, incl. pathe#113 workaround), `formatDuration`/duration coloring, file-icon rules, and hash-color are byte-for-byte or near-identical — delete local copies immediately.
- **Drop a whole theming layer:** retiring `n-`/`context`-color across ~52 components in favor of flat `*-base` tokens + one primary is the single biggest simplification.
- **Overlay/a11y upgrade:** swap three hand-rolled overlays (NDialog/NDrawer/NDropdown, each re-implementing focus-trap/click-outside) for reka-ui primitives — less code, better keyboard/focus behavior; tooltips stay on floating-vue (no engine change).
- **LayoutSplitPane is a drop-in** (same splitpanes + persistence), and FormSelect/SegmentControl/Tabs gain reka-ui semantics over native/fieldset hacks.
- **Distribution shift is the main cost:** moving from the Nuxt-module auto-import (`addComponentsDir`/`addImportsDir`) to full-path imports + `presetAnthonyDesign`, plus relocating dark/clipboard/toast state into the app.
- **Clear new-component candidate:** a `CommandPalette` (NCommand-style) is the one app-general piece @antfu/design lacks and would be reusable beyond DevTools.

---

_Generated from a per-repo source audit of the eight reference projects against the
shipped `@antfu/design` catalog (40 components + `@antfu/design/utils` + `presetAnthonyDesign`
+ `@antfu/design/a11y`). See [PLAN.md](./PLAN.md) §2–3 for the reference-repo list and the
token-dialect study this builds on._
