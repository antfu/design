import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayProgressBar from './DisplayProgressBar.vue'

const meta = {
  title: 'Display/DisplayProgressBar',
  component: DisplayProgressBar,
  tags: ['autodocs'],
  args: { value: 0.6, height: 6, rounded: true, label: 'Progress' },
  decorators: [() => ({ template: '<div class="w-80"><story /></div>' })],
} satisfies Meta<typeof DisplayProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Determinate: Story = {
  args: { value: 0.6 },
}

export const Indeterminate: Story = {
  args: { value: undefined },
}

export const CustomColor: Story = {
  args: { value: 0.75, color: 'hsl(153, 65%, 40%)' },
}

export const Tall: Story = {
  args: { value: 0.4, height: 12 },
}
