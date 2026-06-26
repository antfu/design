import type { ToastItem } from '@antfu/design/components/Feedback/FeedbackToasts.vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from '@antfu/design/components/Action/ActionButton.vue'
import Toasts from '@antfu/design/components/Feedback/FeedbackToasts.vue'
import Drawer from '@antfu/design/components/Overlay/OverlayDrawer.vue'
import Dropdown from '@antfu/design/components/Overlay/OverlayDropdown.vue'
import DropdownItem from '@antfu/design/components/Overlay/OverlayDropdownItem.vue'
import Modal from '@antfu/design/components/Overlay/OverlayModal.vue'
import Tooltip from '@antfu/design/components/Overlay/OverlayTooltip.vue'
import { ref } from 'vue'

const meta = {
  title: 'Tier 2/Overlays',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Tooltips: Story = {
  render: () => ({
    components: { Tooltip, Button },
    template: `<Tooltip content="Tooltip content"><Button>Hover me</Button></Tooltip>`,
  }),
}

export const Dropdowns: Story = {
  render: () => ({
    components: { Dropdown, DropdownItem, Button },
    template: `<Dropdown>
      <template #trigger><Button icon="i-catppuccin:settings">Menu</Button></template>
      <DropdownItem icon="i-catppuccin:folder">Open</DropdownItem>
      <DropdownItem icon="i-catppuccin:typescript">Rename</DropdownItem>
      <DropdownItem icon="i-catppuccin:trash">Delete</DropdownItem>
    </Dropdown>`,
  }),
}

export const Modals: Story = {
  render: () => ({
    components: { Modal, Button },
    setup() {
      return { open: ref(false) }
    },
    template: `<div>
      <Button @click="open = true">Open modal</Button>
      <Modal v-model:open="open" title="Confirm action" description="This cannot be undone.">
        <p class="text-sm color-muted">Modal body content goes here.</p>
        <template #footer>
          <Button variant="text" @click="open = false">Cancel</Button>
          <Button variant="primary" @click="open = false">Confirm</Button>
        </template>
      </Modal>
    </div>`,
  }),
}

export const Drawers: Story = {
  render: () => ({
    components: { Drawer, Button },
    setup() {
      return { open: ref(false) }
    },
    template: `<div>
      <Button @click="open = true">Open drawer</Button>
      <Drawer v-model:open="open" title="Filters">
        <p class="text-sm color-muted">Drawer content slides from the edge.</p>
      </Drawer>
    </div>`,
  }),
}

// Toasts are controlled: the app owns the list (here a local ref) and removes
// items on `dismiss` — the package holds no queue state.
export const ToastsStory: Story = {
  name: 'Toasts',
  render: () => ({
    components: { Button, Toasts },
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
      <Button @click="show">Show toast</Button>
      <Toasts :items="items" position="bottom-right" @dismiss="dismiss" />
    </div>`,
  }),
}
