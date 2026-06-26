import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayDonut from './DisplayDonut.vue'

const meta = {
  title: 'Display/DisplayDonut',
  component: DisplayDonut,
  tags: ['autodocs'],
  args: { value: 0.6, size: 48, thickness: 4 },
} satisfies Meta<typeof DisplayDonut>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { value: 0.6 } }
export const CustomColor: Story = { args: { value: 0.75, size: 64, color: '#3178c6' } }

export const Sizes: Story = {
  render: () => ({
    components: { DisplayDonut },
    template: `<div class="flex items-center gap-4">
      <DisplayDonut :value="0.25" />
      <DisplayDonut :value="0.6" :size="48" />
      <DisplayDonut :value="0.9" :size="64" :thickness="6" />
    </div>`,
  }),
}
