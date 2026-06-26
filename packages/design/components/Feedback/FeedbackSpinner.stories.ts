import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FeedbackSpinner from './FeedbackSpinner.vue'

const meta = {
  title: 'Feedback/FeedbackSpinner',
  component: FeedbackSpinner,
  tags: ['autodocs'],
  args: { size: '1.5em' },
} satisfies Meta<typeof FeedbackSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { size: '1.5em' } }

export const Sizes: Story = {
  render: () => ({
    components: { FeedbackSpinner },
    template: `<div class="flex items-center gap-6">
      <FeedbackSpinner />
      <FeedbackSpinner size="24" />
      <FeedbackSpinner size="2em" />
    </div>`,
  }),
}
