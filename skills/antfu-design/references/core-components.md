# Component catalog

All from `@antfu/design`, explicit imports, token-driven, dark-aware. Components
are grouped into categories and **prefixed with their category** (e.g.
`DisplayBadge`, `FormTextInput`, `OverlayModal`) — the import path mirrors this
(`@antfu/design/components/Display/DisplayBadge.vue`). Overlay behavior comes
from reka-ui; tooltips/poppers from floating-vue; resizable panes from
splitpanes — all themed through the shipped CSS overrides.

> **Dark mode is the app's to own.** The package does not ship `isDark`/`toggleDark`
> or a dark-toggle component. Components that vary by scheme (e.g. hash-colored
> `DisplayBadge`, `DisplayLabel`, `DisplayPackageName`, `DisplayProportionBar`) take a
> `colorScheme: 'light' | 'dark'` prop. For a toggle, compose `ActionIconButton` with
> VueUse's `useDark` — see [recipes.md](recipes.md).

<!-- COMPONENTS:START -->
## Action

| Component | Use it for |
|---|---|
| `ActionButton` | actions. `variant` action/primary/text, polymorphic `href`/`as`, `icon`, `loading`. |
| `ActionIconButton` | a round icon-only button with a `tooltip`, `active` state, `#badge`. Compose with VueUse's `useDark` for a dark toggle. |
| `ActionToggle` | a single pressed/unpressed toggle button (`icon`, `label`). |
| `ActionToggleGroup` | a segmented set of toggles from `options`, single- or multi-select (`multiple`), optionally icon-only. |

## Display

| Component | Use it for |
|---|---|
| `DisplayAvatar` | an image avatar that falls back to hash-colored initials from `name` when `src` is absent/fails. |
| `DisplayBadge` | a status/type/tag chip — hash-colored from text, a palette name (`color="green"`), a hue, or muted. `colorScheme`, `variant`, `icon`, `rounded` (`md`/`full`/em number), `paddingX`/`paddingY`; sized by its own `font-size`. |
| `DisplayBytes` | humanized size, `colorize`, percent of `total`. |
| `DisplayDate` | relative time + exact-date tooltip, `colorize` by age, `live`. |
| `DisplayDonut` | a progress ring. |
| `DisplayDuration` | ms → human, `colorize` by severity. |
| `DisplayFileIcon` | ext/path → icon via a configurable rule list (`rules`, `folderRules`), with an `invert` escape hatch for dark icon sets on light surfaces. |
| `DisplayFilePath` | truncates, dims directories, decodes `.pnpm`, icon, link. |
| `DisplayIconifyRemoteIcon` | renders an Iconify icon by name without a bundled icon set, fetching from the Iconify API. |
| `DisplayKbd` | renders a chord string (e.g. `mod+k`) as platform glyphs. |
| `DisplayKeyValue` | a labeled stat — inline row or stacked, `mono` value, `#badge` adornment. |
| `DisplayLabel` | a fully-rounded `DisplayBadge` (tighter padding) for GitHub-style tags (`colorScheme`). |
| `DisplayNumber` | formatted numbers (`Intl`), mono + tabular, `prefix`/`suffix`. |
| `DisplayNumberBadge` | a `DisplayNumber` in a badge shell — a count pill. |
| `DisplayPackageName` | scope colored by hash (`colorScheme`). |
| `DisplayProgressBar` | a linear progress track — determinate (`value` 0–1) or indeterminate when omitted, `color`, `rounded`. |
| `DisplayProportionBar` | a stacked proportion bar. |
| `DisplaySafeImage` | an `<img>` that swaps to the `#fallback` slot on a missing/failed `src`, with an optional `preload` to avoid a flash. |
| `DisplayTree` | nests a flat `items` list (via `getPath`) or pre-built `nodes` into an expandable file/folder-style tree, with `#leaf`/`#default` slot overrides. |
| `DisplayVersion` | `vX.Y.Z` prefix logic; passes specs/ranges (`workspace:*`, `^1.2`) through untouched. |

## Form

| Component | Use it for |
|---|---|
| `FormCheckbox` | a checkbox control bound with `v-model`. |
| `FormCombobox` | a searchable, filterable select (reka-ui `Combobox`) over an `options` list. |
| `FormField` | wraps a control with a `label`, `description`, and `error` (role="alert"), `required` marker. |
| `FormNumberInput` | a numeric input with `min`/`max`/`step` clamping and optional −/+ stepper `controls`. |
| `FormRadioGroup` | a radio-button group bound with `v-model`. |
| `FormSearchField` | a search input — icon + `DisplayKbd` shortcut hint + clear button. |
| `FormSegmentedControl` | a single-select segmented control (reka-ui `RadioGroup`) over an `options` list, including a valid `null` segment. |
| `FormSelect` | a native-feeling select bound with `v-model`. |
| `FormSwitch` | an on/off switch bound with `v-model`. |
| `FormTextInput` | a single-line text input, `icon`, `invalid` state. |
| `FormTextarea` | a multi-line text input, `rows`, `invalid` state, `resize` toggle. |

## Overlay

| Component | Use it for |
|---|---|
| `OverlayConfirm` | an AlertDialog for a confirm/cancel decision, `variant="danger"` for destructive actions. |
| `OverlayContextMenu` (+ `OverlayContextMenuItem`, `OverlayContextMenuLabel`, `OverlayContextMenuSeparator`) | a right-click menu. |
| `OverlayDrawer` | a slide-in panel from any `side` (left/right/top/bottom). |
| `OverlayDropdown` (+ `OverlayDropdownCheckboxItem`, `OverlayDropdownGroup`, `OverlayDropdownLabel`, `OverlayDropdownRadioGroup`, `OverlayDropdownRadioItem`, `OverlayDropdownSeparator`, `OverlayDropdownSub`) | a trigger-anchored dropdown menu. |
| `OverlayDropdownItem` | a selectable dropdown row — `icon`, `variant="danger"`, trailing `shortcut` (rendered via `DisplayKbd`). |
| `OverlayHoverCard` | a hover-triggered popover with configurable `openDelay`/`closeDelay`. |
| `OverlayModal` | a centered dialog (`title`, `description`, `#trigger` slot). |
| `OverlayTooltip` | a floating-vue tooltip — text `content` or the `#content` slot, configurable `placement`/`delay`/`triggers`, plus a virtual-anchor mode for canvas/graph overlays. |

## Layout

| Component | Use it for |
|---|---|
| `LayoutAccordion` | collapsible sections from `items`; one entry = a single section, `multiple` for several open at once. |
| `LayoutBreadcrumb` | a linked path trail from `items`; the last crumb renders as plain text. |
| `LayoutCard` | a bordered content surface. |
| `LayoutDataTable` | a sortable, generic data table from `columns` + `rows`, optional `stickyHeader`. |
| `LayoutExpandableList` | "show N more" truncation for a list. |
| `LayoutMenubar` | a desktop-style menu bar from a `menus` list of `MenubarMenuEntry`. |
| `LayoutPagination` | page-number navigation. |
| `LayoutPanelGrids` | a `dots`/`grid` background pattern surface for empty states or canvases. |
| `LayoutScrollArea` | a custom-scrollbar scroll container. |
| `LayoutSeparator` | a horizontal/vertical divider, optionally with a centered `label`. |
| `LayoutSideNav` | a vertical nav list from `items`, active-item highlighting via `v-model`. |
| `LayoutSplitPane` | resizable split panes (wraps `splitpanes`). |
| `LayoutTabs` | underline/segment tabs, `count` chips. |
| `LayoutToolbar` | a sticky, glass-surfaced action bar with `#start`/`#search`/`#end` slots. |
| `LayoutVirtualList` | a virtualized list (`@tanstack/vue-virtual`) for large collections. |

## Feedback

| Component | Use it for |
|---|---|
| `FeedbackEmptyState` | an empty/zero-state placeholder — icon, title, description, `#action` slot. |
| `FeedbackLoading` | a loading placeholder wrapping `FeedbackSpinner`. |
| `FeedbackSkeleton` | a shimmer placeholder block for loading content. |
| `FeedbackSpinner` | a spinner glyph. |
| `FeedbackTip` | an inline callout — info/success/warning/error. |
| `FeedbackToasts` | a presentational toast stack (`items`, `position`) — the app owns the list and ids via its own `useToast()`. |
<!-- COMPONENTS:END -->

## Composables & utils

- `@antfu/design/composables` — `useInputFocus`, `provideNotification` / `useNotification`.
  (Dark mode, clipboard and persisted state are **not** wrapped — use the app's own
  state and VueUse `useClipboard` / `useLocalStorage` directly.)
- `@antfu/design/utils` — `getHashColorFromString`, `getPluginColor`, `labelStyle`
  (all take an explicit dark flag), `formatBytes`/`formatDuration`/`formatTimeAgo`
  (+ severity colors), `parseReadablePath`, `parseSemverRange`, `toTree`,
  `parseChord`/`bindingDisplay`, WCAG `contrastRatio`.

> Out this iteration: `CodeBlock` / `DiffView` and the command palette (deferred).
