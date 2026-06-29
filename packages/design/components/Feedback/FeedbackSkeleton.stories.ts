import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FeedbackSkeleton from './FeedbackSkeleton.vue'

const meta = {
  title: 'Feedback/FeedbackSkeleton',
  component: FeedbackSkeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof FeedbackSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {
  render: () => ({
    components: { FeedbackSkeleton },
    template: `<FeedbackSkeleton :lines="3" width="240px" />`,
  }),
}

export const Card: Story = {
  render: () => ({
    components: { FeedbackSkeleton },
    template: `<div class="flex gap-3 items-center w-64">
      <FeedbackSkeleton variant="circle" :width="40" :height="40" />
      <FeedbackSkeleton :lines="2" class="flex-1" />
    </div>`,
  }),
}
