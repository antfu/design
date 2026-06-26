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
import { defineConfig, presetIcons, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetAnthonyDesign({
      primary: '#49833E', // string | full color-scale object (default antfu green)
      darkBackground: '#111', // near-black for dark surfaces
    }),
    presetWind4(), // a base preset is REQUIRED — shortcuts expand into its utilities
    presetIcons(),
    presetWebFonts({ fonts: { sans: 'DM Sans', mono: 'DM Mono' } }),
  ],
  // Generate the components' classes by scanning the installed package:
  content: { pipeline: { include: [/@antfu\/design/] } },
})
```

> The base preset is **yours** to choose (`presetWind4`, `presetWind3` or
> `presetMini`). Without one, the semantic shortcuts have nothing to expand into.
> The design layer is **one preset** — there are no sub-presets to compose.

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
