import { presetAnthonyDesign } from '@antfu/design/unocss'
import presetIcons from '@unocss/preset-icons'
import presetWebFonts from '@unocss/preset-web-fonts'
import presetWind4 from '@unocss/preset-wind4'
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
})
