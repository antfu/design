import presetIcons from '@unocss/preset-icons'
import presetWebFonts from '@unocss/preset-web-fonts'
import presetWind4 from '@unocss/preset-wind4'
import { defineConfig } from 'unocss'
import { presetAnthonyDesign } from '../packages/design/unocss'

// Mirrors what a consuming app configures: the design layer + a base, icons and
// web fonts (which the preset deliberately does not bundle).
export default defineConfig({
  content: {
    filesystem: [
      '../packages/design/components/**/*.vue',
      '../packages/design/{unocss,utils,a11y}/**/*.ts',
      './stories/**/*.{ts,vue}',
      './.storybook/**/*.{ts,vue}',
    ],
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
