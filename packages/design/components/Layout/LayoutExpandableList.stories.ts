import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LayoutExpandableList from './LayoutExpandableList.vue'

// `component` is omitted: this is a generic SFC, which doesn't fit Storybook's
// `Meta<typeof Component>` typing. The render below uses it directly.
const meta = {
  title: 'Layout/LayoutExpandableList',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    components: { LayoutExpandableList },
    setup() {
      return { items: Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`) }
    },
    template: `<div class="w-64">
      <LayoutExpandableList :items="items" :max="4">
        <template #default="{ item }">
          <div class="text-sm py-1 border-b border-base">{{ item }}</div>
        </template>
      </LayoutExpandableList>
    </div>`,
  }),
}
