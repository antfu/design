import presetIcons from '@unocss/preset-icons'
import presetWebFonts from '@unocss/preset-web-fonts'
import presetWind4 from '@unocss/preset-wind4'
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig } from 'unocss'
import { presetAnthonyDesign } from '../packages/design/unocss'

// Mirrors what a consuming app configures: the design layer + a base, icons and
// web fonts (which the preset deliberately does not bundle), plus the named
// overlay z-index layers the preset leaves to the app to own.
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
  // Expands the `--at-apply` token directives in `@antfu/design/styles`.
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
