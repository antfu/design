import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ActionButton from '../Action/ActionButton.vue'
import FeedbackEmptyState from './FeedbackEmptyState.vue'

const meta = {
  title: 'Feedback/FeedbackEmptyState',
  component: FeedbackEmptyState,
  tags: ['autodocs'],
  args: { title: 'No results', icon: 'i-catppuccin:folder' },
} satisfies Meta<typeof FeedbackEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { FeedbackEmptyState },
    template: `<div class="border border-base rounded-lg w-96">
      <FeedbackEmptyState title="No results" icon="i-catppuccin:folder">
        <template #hint>Try a different search term.</template>
      </FeedbackEmptyState>
    </div>`,
  }),
}

export const WithActions: Story = {
  render: () => ({
    components: { FeedbackEmptyState, ActionButton },
    template: `<div class="border border-base rounded-lg w-96">
      <FeedbackEmptyState title="No projects yet" icon="i-catppuccin:folder">
        <template #hint>Create your first project to get started.</template>
        <template #actions>
          <ActionButton variant="primary" icon="i-catppuccin:folder">New project</ActionButton>
        </template>
      </FeedbackEmptyState>
    </div>`,
  }),
}
