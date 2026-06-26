import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import ActionButton from '../Action/ActionButton.vue'
import OverlayModal from './OverlayModal.vue'

const meta = {
  title: 'Overlay/OverlayModal',
  component: OverlayModal,
  tags: ['autodocs'],
  args: { title: 'Confirm action', description: 'This cannot be undone.' },
} satisfies Meta<typeof OverlayModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { OverlayModal, ActionButton },
    setup() {
      return { open: ref(false) }
    },
    template: `<div>
      <ActionButton @click="open = true">Open modal</ActionButton>
      <OverlayModal v-model:open="open" title="Confirm action" description="This cannot be undone.">
        <p class="text-sm color-muted">Modal body content goes here.</p>
        <template #footer>
          <ActionButton variant="text" @click="open = false">Cancel</ActionButton>
          <ActionButton variant="primary" @click="open = false">Confirm</ActionButton>
        </template>
      </OverlayModal>
    </div>`,
  }),
}
