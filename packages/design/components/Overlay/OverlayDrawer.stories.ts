import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import ActionButton from '../Action/ActionButton.vue'
import OverlayDrawer from './OverlayDrawer.vue'

const meta = {
  title: 'Overlay/OverlayDrawer',
  component: OverlayDrawer,
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'inline-radio', options: ['left', 'right', 'top', 'bottom'] },
  },
  args: { title: 'Filters', side: 'right' },
} satisfies Meta<typeof OverlayDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { OverlayDrawer, ActionButton },
    setup() {
      return { open: ref(false) }
    },
    template: `<div>
      <ActionButton @click="open = true">Open drawer</ActionButton>
      <OverlayDrawer v-model:open="open" title="Filters">
        <p class="text-sm color-muted">Drawer content slides from the edge.</p>
      </OverlayDrawer>
    </div>`,
  }),
}

export const LeftSide: Story = {
  render: () => ({
    components: { OverlayDrawer, ActionButton },
    setup() {
      return { open: ref(false) }
    },
    template: `<div>
      <ActionButton @click="open = true">Open left drawer</ActionButton>
      <OverlayDrawer v-model:open="open" title="Navigation" side="left">
        <p class="text-sm color-muted">Slides in from the left.</p>
      </OverlayDrawer>
    </div>`,
  }),
}
