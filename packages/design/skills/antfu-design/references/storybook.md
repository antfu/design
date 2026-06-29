# Storybook recipe

How to document `@antfu/design` components in Storybook: theme-synced manager +
preview, autodocs, and a single generated **Overview** page. Mirrors this repo's
`storybook/.storybook` setup.

## 1. Install

```bash
pnpm add -D storybook @storybook/vue3-vite @storybook/addon-docs \
  @vitejs/plugin-vue unocss vue
```

`@storybook/addon-docs` is what powers both autodocs and MDX doc blocks. If your
stories live in a separate package, add `@storybook/addon-docs` there too — MDX
resolves blocks relative to the file, not the storybook app.

## 2. main.ts — MDX-first glob, docgen off, UnoCSS

```ts
import type { StorybookConfig } from '@storybook/vue3-vite'
import { fileURLToPath } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  // MDX before stories so the Overview can resolve component stories.
  stories: ['../../packages/design/components/**/*.mdx', '../../packages/design/components/**/*.stories.@(ts|js)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/vue3-vite',
    // Package ships raw .vue; disable docgen so it doesn't re-parse compiled output.
    options: { docgen: false },
  },
  viteFinal: base => mergeConfig(base, {
    plugins: [Vue(), Unocss({ configFile: fileURLToPath(new URL('../uno.config.ts', import.meta.url)) })],
    optimizeDeps: { exclude: ['@antfu/design'] },
  }),
}
export default config
```

## 3. The dark-mode toggle that syncs everything

The trap: the **manager** (chrome) and **preview** (iframe) are separate. A
decorator only themes decorated stories, so the docs/MDX page root stays light.
Fix it in three places, all driven by one `theme` global.

**preview.ts** — toggle the preview root from the global (covers docs pages),
plus a decorator for token surfaces:

```ts
import type { Preview } from '@storybook/vue3-vite'
import { GLOBALS_UPDATED } from 'storybook/internal/core-events'
import { addons } from 'storybook/preview-api'
import { h } from 'vue'
import 'virtual:uno.css'
import '../../packages/design/styles/index.css'
import './docs-dark.css'

addons.getChannel().on(GLOBALS_UPDATED, ({ globals }: { globals?: { theme?: string } }) => {
  document.documentElement.classList.toggle('dark', globals?.theme === 'dark')
})

const preview: Preview = {
  parameters: { options: { storySort: { order: ['Overview', '*'] } } },
  globalTypes: { theme: { defaultValue: 'light', toolbar: { title: 'Theme', items: [
    { value: 'light', title: 'Light', icon: 'sun' }, { value: 'dark', title: 'Dark', icon: 'moon' },
  ] } } },
  decorators: [(story, ctx) => {
    document.documentElement.classList.toggle('dark', ctx.globals.theme === 'dark')
    return () => h('div', { class: 'p-8 bg-base color-base font-sans' }, [h(story())])
  }],
}
export default preview
```

**manager.ts** — flip the chrome theme on the same global:

```ts
import { GLOBALS_UPDATED } from 'storybook/internal/core-events'
import { addons } from 'storybook/manager-api'
import { themes } from 'storybook/theming'

addons.register('theme-sync', (api) => {
  const apply = (t?: string): void => api.setOptions({ theme: t === 'dark' ? themes.dark : themes.light })
  apply(api.getGlobals().theme)
  api.getChannel()?.on(GLOBALS_UPDATED, ({ globals }: { globals?: { theme?: string } }) => apply(globals?.theme))
})
```

**docs-dark.css** — autodocs surfaces are static-light, so recolor under `.dark`:

```css
.dark .sbdocs-wrapper, .dark .sbdocs.sbdocs-content { background: #111; }
.dark .sbdocs-preview, .dark .docs-story { background: #111; border-color: #8882; }
.dark .sbdocs h1, .dark .sbdocs h2, .dark .sbdocs p, .dark .sbdocs a { color: #ccc; }
```

## 4. Autodocs + a single Overview page

- Add `tags: ['autodocs']` to each `*.stories.ts` meta for a per-component Docs page.
- Build one **Overview** as MDX. `<Stories of>` only lists the *current* page —
  to embed another file's story use `<Canvas of={X.Story} />`. Title each as a
  link to its docs page (`/?path=/docs/<category>-<name>--docs`):

```mdx
import { Canvas, Meta } from '@storybook/addon-docs/blocks'
import * as ActionButton from './Action/ActionButton.stories'

<Meta title="Overview" />

### [ActionButton](/?path=/docs/action-actionbutton--docs)
<Canvas of={ActionButton.Primary} />
```

- **Generate it** from disk so it never drifts — one linked title + a `<Canvas>`
  per export — and re-run when components/stories change (see
  `scripts/gen-overview.mjs` + `pnpm run docs:overview`).
