import presetIcons from '@unocss/preset-icons'
import presetWebFonts from '@unocss/preset-web-fonts'
import presetWind4 from '@unocss/preset-wind4'
import { defineConfig } from 'unocss'
import { presetAnthonyDesign } from '../packages/design/unocss'

// Mirrors what a consuming app configures: the design layer + a base, icons and
// web fonts (which the preset deliberately does not bundle).
export default defineConfig({
  content: {
    pipeline: {
      // UnoCSS's default scan pipeline covers `.vue`/`.tsx`/etc. but not plain
      // `.ts` (utility `.ts` files opt in with a `// @unocss-include` mark). The
      // co-located `*.stories.ts` reference demo icons (e.g. `i-ph:folder`) as
      // string literals, so add them to the pipeline alongside the defaults.
      include: [
        /\.(?:vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        /\.stories\.[jt]s($|\?)/,
      ],
    },
  },
  presets: [
    presetAnthonyDesign(),
    presetWind4(),
    presetIcons({ scale: 1.2 }),
    presetWebFonts({
      provider: 'none',
      fonts: { sans: 'DM Sans', mono: 'DM Mono' },
    }),
  ],
})
