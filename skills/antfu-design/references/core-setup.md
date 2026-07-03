# Setup

Install the package and a UnoCSS base. It's a **single preset, not
self-contained** — it bundles no base preset, icons, fonts, or reset.

```bash
pnpm add @antfu/design unocss
```

## Wiring the preset

```ts
// uno.config.ts
import { presetAnthonyDesign } from '@antfu/design/unocss'
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetIcons, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetAnthonyDesign({
      primary: '#49833E', // string | full color-scale object (default antfu green)
      darkBackground: '#111', // near-black for dark surfaces
      // overrides: { 'bg-base': 'bg-zinc-50 dark:bg-zinc-950' }, // retune any built-in shortcut
    }),
    presetWind4(), // a base preset is REQUIRED — shortcuts expand into its utilities
    presetIcons(),
    presetWebFonts({ fonts: { sans: 'DM Sans', mono: 'DM Mono' } }),
  ],
  // REQUIRED: the shipped `@antfu/design/styles` recolor third-party overlays with
  // token `--at-apply` directives — this transformer is what expands them.
  transformers: [transformerDirectives()],
  // No `content.pipeline.include` needed: UnoCSS's default scan matches `.vue`/`.tsx`
  // by extension (its only default exclude is CSS, not `node_modules`), so imported
  // components are picked up. If you DO set `include`, it REPLACES the default scan —
  // restate your own sources or they stop generating.
})
```

> The base preset is **yours** to choose (`presetWind4`, `presetWind3` or
> `presetMini`). Without one, the semantic shortcuts have nothing to expand into.
> The design layer is **one preset** — there are no sub-presets to compose.

> `presetAnthonyDesign`'s `fonts` option is a **brand-name override**, not a
> full font stack — you never need to pass the base preset's generic-fallback
> chain (`ui-sans-serif, system-ui, …, sans-serif, …`) through it just to avoid
> losing it. Whatever name it resolves to (a custom one, or the `DM Sans` / `DM
> Mono` default) is composed onto the base preset's own fallback chain, not
> swapped in for it — `font-sans` / `font-mono` stay fallback-safe out of the
> box, with or without `presetWebFonts`, regardless of preset order.

> **`@unocss/transformer-directives` is required**, not optional: the design
> system's own CSS (`base.css`, `floating-vue.css`, `splitpanes.css`) styles
> surfaces with token directives like `--at-apply: 'bg-base color-base'` instead of
> hand-duplicated hex values. Without the transformer those rules are dropped and
> overlays/surfaces lose their theming. It also lets *you* reuse the tokens in your
> own CSS (`.panel { --at-apply: 'bg-base border border-base'; }`).

## Recommended: the UnoCSS ESLint plugin

Add [`@unocss/eslint-plugin`](https://unocss.dev/integrations/eslint) so the
guardrails surface as you type instead of silently dropping at build time. It's
where the blocklist's messages show up — e.g. a plain `z-50` is flagged with the
"use a named layer" hint — and it keeps class order/duplication tidy. This
feedback loop is the intended way to work with the design system.

```js
// eslint.config.js
import unocss from '@unocss/eslint-plugin'

export default [
  unocss(),
]
```

## z-index layers (you own them)

Stacking is a whole-app concern, so the preset ships **no** z-index scale and
**blocks plain `z-<number>` / `z-[…]` utilities** (`z-auto` stays allowed) — every
z-index must flow through a *named* layer you define in your own UnoCSS
`shortcuts`. The overlay components reference these names; without them, overlays
have no stacking value. Define them once, alongside the preset, and tune the
numbers to fit your app:

```ts
// uno.config.ts (top-level — NOT inside the preset)
export default defineConfig({
  presets: [presetAnthonyDesign(), presetWind4()],
  transformers: [transformerDirectives()],
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

These are *reference* values — the only contract is the **ordering** (`z-nav` <
`z-dropdown` < `z-tooltip` < `z-toast` < `z-modal-backdrop` < `z-modal-content` <
`z-drawer-backdrop` < `z-drawer-content`) so a modal sits over a dropdown, a drawer
over a modal. The block lifts each utility *defined in `shortcuts`* — only plain
z-index written in markup is rejected. Disable the guardrail with
`presetAnthonyDesign({ blocklists: { plainZIndex: false } })`.

## Styles

```ts
import '@antfu/design/styles.css' // everything
// …or cherry-pick:
import '@antfu/design/styles/floating-vue.css'
```

Add a reset yourself (`@unocss/reset`) — the design system does not bundle one.

## Components

Imported by **full path** (no barrel), categorized and category-prefixed:

```ts
import ActionButton from '@antfu/design/components/Action/ActionButton.vue'
import DisplayBadge from '@antfu/design/components/Display/DisplayBadge.vue'
import OverlayModal from '@antfu/design/components/Overlay/OverlayModal.vue'
```

The package ships raw `.ts` / `.vue` — your build compiles it. No auto-import resolver.
