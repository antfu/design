import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ActionButton from '../Action/ActionButton.vue'
import OverlayConfirm from './OverlayConfirm.vue'

const meta = {
  title: 'Overlay/OverlayConfirm',
  component: OverlayConfirm,
  tags: ['autodocs'],
} satisfies Meta<typeof OverlayConfirm>

export default meta
type Story = StoryObj<typeof meta>

export const Danger: Story = {
  render: () => ({
    components: { OverlayConfirm, ActionButton },
    template: `<OverlayConfirm
      title="Delete project?"
      description="This permanently removes the project and all its data. This cannot be undone."
      confirm-label="Delete"
      variant="danger"
    >
      <template #trigger><ActionButton icon="i-ph:trash">Delete</ActionButton></template>
    </OverlayConfirm>`,
  }),
}
