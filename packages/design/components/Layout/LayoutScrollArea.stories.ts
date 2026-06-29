import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LayoutScrollArea from './LayoutScrollArea.vue'

const meta = {
  title: 'Layout/LayoutScrollArea',
  component: LayoutScrollArea,
  tags: ['autodocs'],
} satisfies Meta<typeof LayoutScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { LayoutScrollArea },
    template: `<div class="border border-base rounded-lg h-48 w-64">
      <LayoutScrollArea>
        <ul class="text-sm divide-y divide-#8882">
          <li v-for="n in 40" :key="n" class="px-3 py-2">Row {{ n }}</li>
        </ul>
      </LayoutScrollArea>
    </div>`,
  }),
}
