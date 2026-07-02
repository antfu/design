// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    vue: true,
    unocss: true,
    pnpm: true,
    ignores: [
      '**/dist',
      '**/*.snap',
      '**/storybook-static',
      'skills/**/*.md',
      'README.md',
    ],
  },
)
