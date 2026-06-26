import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LayoutVirtualList from './LayoutVirtualList.vue'

// `component` is omitted: this is a generic SFC, which doesn't fit Storybook's
// `Meta<typeof Component>` typing. The render below uses it directly.
const meta = {
  title: 'Layout/LayoutVirtualList',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    components: { LayoutVirtualList },
    setup() {
      return { items: Array.from({ length: 10000 }, (_, i) => `Row ${i + 1}`) }
    },
    template: `<div class="border border-base rounded-lg h-72 w-72">
      <LayoutVirtualList :items="items" class="h-full" :estimate-size="32">
        <template #default="{ item, index }">
          <div class="text-sm font-mono px-3 py-1.5 border-b border-base flex h-8 items-center" :class="{ 'bg-secondary': index % 2 }">
            {{ item }}
          </div>
        </template>
      </LayoutVirtualList>
    </div>`,
  }),
}
