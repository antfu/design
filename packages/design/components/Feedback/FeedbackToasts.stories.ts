import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ToastItem } from './FeedbackToasts.vue'
import { ref } from 'vue'
import ActionButton from '../Action/ActionButton.vue'
import FeedbackToasts from './FeedbackToasts.vue'

const meta = {
  title: 'Feedback/FeedbackToasts',
  component: FeedbackToasts,
  tags: ['autodocs'],
  args: { items: [] }, // required prop; the story drives a live list via render
} satisfies Meta<typeof FeedbackToasts>

export default meta
type Story = StoryObj<typeof meta>

// Toasts are controlled: the app owns the list (here a local ref) and removes
// items on `dismiss` — the package holds no queue state.
export const Default: Story = {
  render: () => ({
    components: { ActionButton, FeedbackToasts },
    setup() {
      const items = ref<ToastItem[]>([])
      let counter = 0
      function dismiss(id: string | number): void {
        items.value = items.value.filter(i => i.id !== id)
      }
      function show(): void {
        const id = ++counter
        items.value.push({ id, title: 'Saved', message: 'Your changes were saved.', type: 'success', icon: 'i-catppuccin:folder' })
        setTimeout(dismiss, 4000, id)
      }
      return { items, show, dismiss }
    },
    template: `<div>
      <ActionButton @click="show">Show toast</ActionButton>
      <FeedbackToasts :items="items" position="bottom-right" @dismiss="dismiss" />
    </div>`,
  }),
}
