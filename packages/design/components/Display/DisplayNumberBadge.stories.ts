import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayNumberBadge from './DisplayNumberBadge.vue'

const meta = {
  title: 'Display/DisplayNumberBadge',
  component: DisplayNumberBadge,
  tags: ['autodocs'],
  args: { value: 128, prefix: '×' },
} satisfies Meta<typeof DisplayNumberBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { value: 128, prefix: '×' } }
export const Colored: Story = { args: { value: 42, color: 'green' } }

export const Examples: Story = {
  render: () => ({
    components: { DisplayNumberBadge },
    template: `<div class="flex items-center gap-2">
      <DisplayNumberBadge :value="128" prefix="×" />
      <DisplayNumberBadge :value="42" color="green" />
      <DisplayNumberBadge :value="0.42" :options="{ style: 'percent' }" color="blue" />
    </div>`,
  }),
}
