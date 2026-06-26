import presetIcons from '@unocss/preset-icons'
import presetWebFonts from '@unocss/preset-web-fonts'
import presetWind4 from '@unocss/preset-wind4'
import { defineConfig } from 'unocss'
import { presetAnthonyDesign } from './unocss'

/**
 * Dogfoods the preset on the package's own sources (and feeds the UnoCSS ESLint
 * plugin). Consumers compose their own base/icons/fonts exactly like this — the
 * preset bundles none.
 */
export default defineConfig({
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
