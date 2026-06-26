import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FeedbackTip from './FeedbackTip.vue'

const meta = {
  title: 'Feedback/FeedbackTip',
  component: FeedbackTip,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] },
  },
  args: { type: 'info' },
} satisfies Meta<typeof FeedbackTip>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  render: () => ({
    components: { FeedbackTip },
    template: `<FeedbackTip type="info" class="w-96">An informational note.</FeedbackTip>`,
  }),
}

export const Types: Story = {
  render: () => ({
    components: { FeedbackTip },
    template: `<div class="flex flex-col gap-3 w-96">
      <FeedbackTip type="info" icon="i-ph:folder">An informational note.</FeedbackTip>
      <FeedbackTip type="success">Saved successfully.</FeedbackTip>
      <FeedbackTip type="warning">Careful with this setting.</FeedbackTip>
      <FeedbackTip type="error">Something went wrong.</FeedbackTip>
    </div>`,
  }),
}
