# @antfu/design

> A customizable, **composable** design system for devtools-style Vue apps: a
> UnoCSS preset (`presetAnthonyDesign`), a set of Vue primitives, a ground-up
> design skill, and a color-contrast a11y check. Something in between a component
> library and shadcn.

## Install

```bash
pnpm add @antfu/design unocss vue
```

## Quick start

```ts
// uno.config.ts
import { presetAnthonyDesign } from '@antfu/design/unocss'
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetIcons, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetAnthonyDesign({ primary: '#49833E' }),
    presetWind4(), // a base preset is required — bring your own
    presetIcons(),
    presetWebFonts({ fonts: { sans: 'DM Sans', mono: 'DM Mono' } }),
  ],
  // Required — the shipped styles recolor overlays with token `--at-apply`
  // directives; this transformer expands them (and lets you reuse tokens in CSS).
  transformers: [transformerDirectives()],
  // The preset ships no z-index scale (stacking is the app's to own) and blocks
  // plain `z-<number>`. Define the named layers the overlay components use here —
  // these values are yours; tune them to fit your app's stack.
  shortcuts: {
    'z-nav': 'z-[30]',
    'z-dropdown': 'z-[40]',
    'z-tooltip': 'z-[45]',
    'z-toast': 'z-[50]',
    'z-modal-backdrop': 'z-[60]',
    'z-modal-content': 'z-[70]',
    'z-drawer-backdrop': 'z-[80]',
    'z-drawer-content': 'z-[90]',
  },
})
```

> Pair it with [`@unocss/eslint-plugin`](https://unocss.dev/integrations/eslint)
> for the feedback loop — it surfaces the blocklist hints (e.g. a plain `z-50`) in
> your editor and CI instead of silently dropping at build time.

```ts
// Components are imported by full path (no barrel) — categorized and prefixed:
import ActionButton from '@antfu/design/components/Action/ActionButton.vue'
import DisplayBadge from '@antfu/design/components/Display/DisplayBadge.vue'
import OverlayModal from '@antfu/design/components/Overlay/OverlayModal.vue'
import '@antfu/design/styles.css' // everything, incl. splitpanes/reka/floating-vue overrides
```

`styles.css` bundles every overlay engine's override. If you don't use them all,
cherry-pick instead so unused (`splitpanes`/`reka-ui`) CSS never ships:

```ts
import '@antfu/design/styles/base.css'
import '@antfu/design/styles/scrollbar.css'
import '@antfu/design/styles/floating-vue.css' // only if you use tooltips
```

The package ships **raw `.ts` / `.vue` source** (no bundling) — your build
compiles it. No extra `content` config is needed: UnoCSS's default scan matches
`.vue`/`.tsx` by extension (its only default exclude is CSS, not `node_modules`),
so the components you import are picked up automatically. If you *do* set
`content.pipeline.include`, note it **replaces** the default scan rather than
extending it — restate the defaults too, or your own sources stop being generated.

It's a **single** preset that is **not self-contained**: it contributes only the
antfu design layer (theme tokens, semantic shortcuts, dynamic rules, severity).
You compose the base preset, icons, fonts and reset yourself — and add
`@unocss/transformer-directives` (the shipped styles use token `--at-apply`
directives) plus, recommended, `@unocss/eslint-plugin` for the feedback loop.

## Exports

| Subpath | What |
|---|---|
| `./components/*` | one readable `.vue` per component (e.g. `./components/Display/DisplayBadge.vue`) |
| `./unocss` | the single `presetAnthonyDesign` preset |
| `./utils` | color, format, path, semver, contrast, keybinding helpers (pure, stateless) |
| `./composables/*` | Vue helpers: `colorScheme` (opt-in scheme context) and `toast` (`useToast` queue) |
| `./a11y` | programmatic color-contrast scan |
| `./styles.css`, `./styles/*` | all styles, or per-concern files |
| `./splitpanes.d.ts` | opt-in fallback types for older `splitpanes` (v4.1.2+ ships its own) |

> The package is **stateless** — no dark-mode/clipboard/toast state. Components
> that vary by scheme take a `colorScheme` prop; toasts are controlled. Use VueUse
> directly for state.
>
> Two **opt-in** helpers reduce the boilerplate without adding global state:
> `provideColorScheme(() => isDark ? 'dark' : 'light')` (from `@antfu/design/composables/colorScheme`)
> lets scheme-aware components inherit the scheme instead of threading a prop, and
> `useToast()` (from `@antfu/design/composables/toast`) owns a toast queue for
> `FeedbackToasts`. Both only read state you own.

## Accessibility

A color-contrast scan (axe-core + Playwright) runs a URL in light **and** dark
mode. Use it programmatically:

```ts
import { formatContrastReport, runContrastScan } from '@antfu/design/a11y'

const result = await runContrastScan({ url: 'http://localhost:6006/iframe.html' })
console.log(formatContrastReport(result))
```

…or run the bundled script with `tsx`:

```bash
tsx node_modules/@antfu/design/a11y/cli.ts http://localhost:6006/iframe.html
```

## Tokens

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
| `pad-safe-t` | `pt-[env(safe-area-inset-top)]` |
| `pad-safe-r` | `pr-[env(safe-area-inset-right)]` |
| `pad-safe-b` | `pb-[env(safe-area-inset-bottom)]` |
| `pad-safe-l` | `pl-[env(safe-area-inset-left)]` |
| `pad-safe-x` | `pad-safe-l pad-safe-r` |
| `pad-safe-y` | `pad-safe-t pad-safe-b` |
| `pad-safe` | `pad-safe-x pad-safe-y` |

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
| `scroll-fade` / `scroll-fade-{x,y,t,b,l,r,s,e}` | scroll-aware edge fade (`scroll-fade-<n>`, `scroll-fade-none`); pairs with `no-scrollbar` |
| `shimmer` / `shimmer-{once,reverse,none}` | text shimmer over `currentColor` (`shimmer-{color,duration,spread,angle}-*`) |
<!-- TOKENS:END -->

## License

[MIT](./LICENSE) © [Anthony Fu](https://github.com/antfu)
