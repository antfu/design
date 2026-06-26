import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayDate from './DisplayDate.vue'

const meta = {
  title: 'Display/DisplayDate',
  component: DisplayDate,
  tags: ['autodocs'],
  args: { date: Date.now() }, // required prop; stories supply their own via render
} satisfies Meta<typeof DisplayDate>

export default meta
type Story = StoryObj<typeof meta>

export const Recent: Story = {
  args: { date: Date.now() - 1000 * 60 * 5 },
}

export const Old: Story = {
  args: { date: Date.now() - 1000 * 60 * 60 * 24 * 400 },
}

export const Colorized: Story = {
  render: () => ({
    components: { DisplayDate },
    setup() {
      const now = Date.now()
      return {
        recent: now - 1000 * 60 * 5,
        old: now - 1000 * 60 * 60 * 24 * 400,
      }
    },
    template: `<div class="flex flex-col gap-1">
      <DisplayDate :date="recent" colorize />
      <DisplayDate :date="old" colorize />
    </div>`,
  }),
}
