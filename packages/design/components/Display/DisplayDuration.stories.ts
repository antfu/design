import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayDuration from './DisplayDuration.vue'

const meta = {
  title: 'Display/DisplayDuration',
  component: DisplayDuration,
  tags: ['autodocs'],
  args: { ms: 750 },
} satisfies Meta<typeof DisplayDuration>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { ms: 750 } }
export const Colorized: Story = { args: { ms: 3200, colorize: true } }

export const Scale: Story = {
  render: () => ({
    components: { DisplayDuration },
    template: `<div class="flex flex-col gap-1">
      <DisplayDuration :ms="12" colorize />
      <DisplayDuration :ms="180" colorize />
      <DisplayDuration :ms="750" colorize />
      <DisplayDuration :ms="3200" colorize />
      <DisplayDuration :ms="9000" colorize />
    </div>`,
  }),
}
