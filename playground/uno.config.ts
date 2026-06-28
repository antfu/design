import { presetAnthonyDesign } from '@antfu/design/unocss'
import presetIcons from '@unocss/preset-icons'
import presetWebFonts from '@unocss/preset-web-fonts'
import presetWind4 from '@unocss/preset-wind4'
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig } from 'unocss'

export default defineConfig({
  // Scan the installed package so the components' classes are generated.
  content: { pipeline: { include: [/@antfu\/design/, /\.vue$/] } },
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
  // The preset ships no z-index scale — the app owns the named overlay layers
  // (plain `z-<number>` is blocked). Redefine these values to match your stack.
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
