# Component catalog

All from `@antfu/design`, explicit imports, token-driven, dark-aware. Components
are grouped into categories and **prefixed with their category** (e.g.
`DisplayBadge`, `FormTextInput`, `OverlayModal`) — the import path mirrors this
(`@antfu/design/components/Display/DisplayBadge.vue`). Overlay behavior comes
from reka-ui; tooltips/poppers from floating-vue; resizable panes from
splitpanes — all themed through the shipped CSS overrides.

> **Dark mode is the app's to own.** The package does not ship `isDark`/`toggleDark`.
> Components that vary by scheme (e.g. hash-colored `DisplayBadge`, `DisplayLabel`,
> `DisplayPackageName`, `DisplayProportionBar`) take a `colorScheme: 'light' | 'dark'`
> prop. `ActionDarkToggle` is **controlled**: `colorScheme` prop + `update:colorScheme`.

## Action

| Component | Use it for |
|---|---|
| `ActionButton` | actions. `variant` action/primary/text, polymorphic `href`/`as`, `icon`, `loading`. |
| `ActionIconButton` | a round icon-only button with a `tooltip`, `active` state, `#badge`. |
| `ActionDarkToggle` | controlled dark toggle (`v-model:colorScheme`) with a view-transition reveal. |

## Display

| Component | Use it for |
|---|---|
| `DisplayBadge` | a status/type/tag chip — hash-colored from text, a palette name (`color="green"`), a hue, or muted. `colorScheme`, `variant`, `size`, `icon`. |
| `DisplayNumber` / `DisplayNumberBadge` | formatted numbers (`Intl`), mono + tabular, `prefix`/`suffix`. |
| `DisplayDuration` | ms → human, `colorize` by severity. |
| `DisplayBytes` | humanized size, `colorize`, percent of `total`. |
| `DisplayDate` | relative time + exact-date tooltip, `colorize` by age, `live`. |
| `DisplayVersion` | `vX.Y.Z` prefix logic. |
| `DisplayPackageName` | scope colored by hash (`colorScheme`). |
| `DisplayFilePath` | truncates, dims directories, decodes `.pnpm`, icon, link. |
| `DisplayFileIcon` | ext → icon via a configurable rule list. |
| `DisplayLabel` | hex → contrast-aware tinted chip (`colorScheme`). |
| `DisplayStatusPill` | severity dot + label, `pulse`. |
| `DisplayDonut` / `DisplayProportionBar` | progress ring / stacked proportion bar. |
| `DisplayKbd` | renders `mod+k` as platform glyphs. |

## Form

`FormTextInput`, `FormSearchField` (icon + `DisplayKbd` hint + clear),
`FormCheckbox`, `FormSwitch`, `FormRadioGroup`, `FormSelect`.

## Overlay

`OverlayModal`, `OverlayDrawer`, `OverlayDropdown` (+ `OverlayDropdownItem`),
`OverlayTooltip`.

## Layout

`LayoutCard`, `LayoutSectionBlock` (collapsible), `LayoutSplitPane` (+ `Pane`),
`LayoutTabs` (underline/segment, `count` chips), `LayoutVirtualList`
(`@tanstack/vue-virtual`), `LayoutExpandableList` ("show N more").

## Feedback

`FeedbackSpinner`, `FeedbackLoading`, `FeedbackEmptyState`, `FeedbackTip`
(info/success/warning/error), `FeedbackToastProvider` (+ `useNotification()`).

## Composables & utils

- `@antfu/design/composables` — `useInputFocus`, `provideNotification` / `useNotification`.
  (Dark mode, clipboard and persisted state are **not** wrapped — use the app's own
  state and VueUse `useClipboard` / `useLocalStorage` directly.)
- `@antfu/design/utils` — `getHashColorFromString`, `getPluginColor`, `labelStyle`
  (all take an explicit dark flag), `formatBytes`/`formatDuration`/`formatTimeAgo`
  (+ severity colors), `parseReadablePath`, `parseSemverRange`, `toTree`,
  `parseChord`/`bindingDisplay`, WCAG `contrastRatio`.

> Out this iteration: `CodeBlock` / `DiffView` and the command palette (deferred).
