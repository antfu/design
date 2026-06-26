import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayNumber from './DisplayNumber.vue'

const meta = {
  title: 'Display/DisplayNumber',
  component: DisplayNumber,
  tags: ['autodocs'],
  args: { value: 1234567 },
} satisfies Meta<typeof DisplayNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { value: 1234567 } }
export const WithSuffix: Story = { args: { value: 42, suffix: 'ms' } }
export const Percent: Story = { args: { value: 0.42, options: { style: 'percent' } } }

export const Formats: Story = {
  render: () => ({
    components: { DisplayNumber },
    template: `<div class="flex flex-col gap-2">
      <DisplayNumber :value="1234567" />
      <DisplayNumber :value="42" suffix="ms" />
      <DisplayNumber :value="0.42" :options="{ style: 'percent' }" />
    </div>`,
  }),
}
