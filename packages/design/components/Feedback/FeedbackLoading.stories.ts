import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FeedbackLoading from './FeedbackLoading.vue'

const meta = {
  title: 'Feedback/FeedbackLoading',
  component: FeedbackLoading,
  tags: ['autodocs'],
  args: { text: 'Loading data…' },
} satisfies Meta<typeof FeedbackLoading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { text: 'Loading data…' } }

export const Panel: Story = {
  render: () => ({
    components: { FeedbackLoading },
    template: `<div class="border border-base rounded-lg h-40 w-72">
      <FeedbackLoading text="Loading…" panel />
    </div>`,
  }),
}
