import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayTree from './DisplayTree.vue'

// `component` is omitted: this is a generic SFC, which doesn't fit Storybook's
// `Meta<typeof Component>` typing. The renders below use it directly.
const meta = {
  title: 'Display/DisplayTree',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

const files = [
  'src/main.ts',
  'src/App.vue',
  'src/components/Button.vue',
  'src/components/Input.vue',
  'src/utils/format.ts',
  'src/utils/tree.ts',
  'package.json',
  'README.md',
]

export const Default: Story = {
  render: () => ({
    components: { DisplayTree },
    setup() {
      return { items: files, getPath: (f: string) => f }
    },
    template: `<div class="w-72">
      <DisplayTree :items="items" :get-path="getPath" />
    </div>`,
  }),
}

export const WithFileIcons: Story = {
  render: () => ({
    components: { DisplayTree },
    setup() {
      return { items: files, getPath: (f: string) => f }
    },
    template: `<div class="w-72">
      <DisplayTree :items="items" :get-path="getPath" file-icons />
    </div>`,
  }),
}

export const Collapsed: Story = {
  render: () => ({
    components: { DisplayTree },
    setup() {
      return { items: files, getPath: (f: string) => f }
    },
    template: `<div class="w-72">
      <DisplayTree :items="items" :get-path="getPath" :default-expanded="false" file-icons />
    </div>`,
  }),
}

export const CustomLeaf: Story = {
  render: () => ({
    components: { DisplayTree },
    setup() {
      return { items: files, getPath: (f: string) => f }
    },
    template: `<div class="w-72">
      <DisplayTree :items="items" :get-path="getPath" file-icons>
        <template #leaf="{ node }">
          <span class="color-base">{{ node.name }}</span>
          <span class="text-micro color-faint">leaf</span>
        </template>
      </DisplayTree>
    </div>`,
  }),
}
