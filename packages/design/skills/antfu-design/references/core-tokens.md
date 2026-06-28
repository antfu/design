# Token reference

This is the **canonical token vocabulary** — the contract between the preset,
the components, and your app code. Use these names verbatim; do not hand-roll
equivalents.

The table below is **generated from the preset** (`pnpm docs:gen`), so it can
never drift from what the shortcuts actually resolve to.

<!-- TOKENS:START -->
### Semantic & composite shortcuts

| Token | Expands to |
|---|---|
| `color-base` | `color-neutral-800 dark:color-neutral-200` |
| `color-muted` | `color-neutral-600 dark:color-neutral-400` |
| `color-faint` | `color-neutral-500 dark:color-neutral-500` |
| `color-active` | `color-primary-600 dark:color-primary-300` |
| `bg-base` | `bg-white dark:bg-#111` |
| `bg-secondary` | `bg-#f5f5f5 dark:bg-#1a1a1a` |
| `bg-active` | `bg-#8881` |
| `bg-hover` | `bg-primary/5` |
| `bg-code` | `bg-gray-500/5` |
| `bg-tooltip` | `bg-white/75 dark:bg-#111/75 backdrop-blur-8` |
| `bg-gradient-more` | `bg-gradient-to-t from-white via-white/80 to-white/0 dark:from-#111 dark:via-#111/80 dark:to-#111/0` |
| `border-base` | `border-#8882` |
| `border-mute` | `border-#8881` |
| `border-active` | `border-primary-600/25 dark:border-primary-400/25` |
| `ring-base` | `ring-#8882` |
| `op-fade` | `op65 dark:op55` |
| `op-mute` | `op30 dark:op25` |
| `btn-action` | `border border-base rounded flex gap-2 items-center px2 py1 op75 hover:op100 hover:bg-active transition disabled:pointer-events-none disabled:op30! outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40` |
| `btn-action-sm` | `btn-action text-sm` |
| `btn-action-active` | `color-active border-active! bg-active op100!` |
| `btn-icon` | `w-9 h-9 rounded-full op-fade hover:op100 hover:bg-active transition flex items-center justify-center disabled:pointer-events-none disabled:op30 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40` |
| `btn-icon-compact` | `w-6 h-6 rounded op-fade hover:op100 hover:bg-active transition flex items-center justify-center disabled:pointer-events-none disabled:op30 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40` |
| `btn-icon-square` | `w-9 h-9 rounded border border-base op-fade hover:op100 hover:bg-active transition flex items-center justify-center disabled:pointer-events-none disabled:op30 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40` |
| `btn-primary` | `px3 py1.5 rounded flex gap-2 items-center bg-primary-500 hover:bg-primary-600 text-white transition disabled:op50 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40` |
| `badge` | `inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium leading-none` |
| `badge-active` | `badge bg-active color-active` |
| `badge-muted` | `badge bg-#8881 color-muted` |

### Severity scale

| Token | Expands to |
|---|---|
| `color-scale-neutral` | `text-gray-700 dark:text-gray-300` |
| `color-scale-low` | `text-lime-700 dark:text-lime-300 dark:saturate-75` |
| `color-scale-medium` | `text-amber-700 dark:text-amber-300 dark:saturate-90` |
| `color-scale-high` | `text-orange-700 dark:text-orange-300` |
| `color-scale-critical` | `text-red-700 dark:text-red-300` |

### Type sizes

| Token | Expands to |
|---|---|
| `text-micro` | `text-[10px] leading-[1.4]` |
| `text-mini` | `text-[11px] leading-[1.45]` |
| `text-compact` | `text-[12px] leading-[1.5]` |

### Dynamic

| Token | Expands to |
|---|---|
| `badge-color-<name>` | a chip tinted by any palette color name (dark-aware) |
| `bg-glass` / `bg-glass:<n>` | translucent surface + `backdrop-blur` |
| `bg-dots` / `bg-dots-<n>` | radial dot-grid background, variable cell size in px (default 16) |
| `bg-grid` / `bg-grid-<n>` | crosshatch grid-lines background, variable cell size in px (default 16) |
<!-- TOKENS:END -->

## How to read it

- **Semantic shortcuts** (`bg-base`, `color-muted`, `border-base`, `op-fade`, …)
  are the everyday vocabulary. They expand to the listed utilities and carry a
  dark variant.
- **Composite shortcuts** (`btn-action`, `btn-primary`, `badge`) expand to a full
  recipe — use them as-is.
- **Dynamic** `badge-color-<name>` tints a chip by any palette color name; `bg-glass`
  / `bg-glass:<n>` makes a translucent blurred surface.
- **Severity** `color-scale-{neutral,low,medium,high,critical}` is the one ramp
  for fresh→stale / fast→slow / small→large. Prefer the `colorize` prop on display
  components over using these directly.
- **z-index**: always a named layer (`z-nav`, `z-dropdown`, `z-modal-content`, …),
  never plain `z-<n>` — the preset blocks plain z-index. The preset ships **no**
  values; the app defines the named layers in its own `shortcuts`. See
  [core-setup.md](core-setup.md#z-index-layers-you-own-them).
- **Theme**: `font-sans` = DM Sans, `font-mono` = DM Mono; extra sizes
  `text-micro` / `text-mini` / `text-compact`; color ramps `primary` (default
  antfu green), `warning`, `success`, `error`.
