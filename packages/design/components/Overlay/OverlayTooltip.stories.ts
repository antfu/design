import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import ActionButton from '../Action/ActionButton.vue'
import OverlayTooltip from './OverlayTooltip.vue'

const meta = {
  title: 'Overlay/OverlayTooltip',
  component: OverlayTooltip,
  tags: ['autodocs'],
  args: { content: 'Tooltip content' },
} satisfies Meta<typeof OverlayTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { OverlayTooltip, ActionButton },
    template: `<OverlayTooltip content="Tooltip content"><ActionButton>Hover me</ActionButton></OverlayTooltip>`,
  }),
}

export const RichContent: Story = {
  render: () => ({
    components: { OverlayTooltip, ActionButton },
    template: `<OverlayTooltip placement="bottom">
      <ActionButton>Hover for rich content</ActionButton>
      <template #content>
        <div class="font-medium">Title</div>
        <div class="text-xs op75">A richer popper body.</div>
      </template>
    </OverlayTooltip>`,
  }),
}

export const Anchored: Story = {
  render: () => ({
    components: { OverlayTooltip },
    setup() {
      const at = ref<{ x: number, y: number }>()
      function move(e: MouseEvent): void {
        at.value = { x: e.clientX, y: e.clientY }
      }
      return { at, move }
    },
    // Anchor a popover to an arbitrary point (e.g. a hovered node on a canvas/graph).
    template: `<div
      class="text-sm color-muted border border-base rounded-lg bg-secondary h-40 flex items-center justify-center"
      @mousemove="move"
      @mouseleave="at = undefined"
    >
      Move the cursor here
      <OverlayTooltip :anchor="at" :shown="!!at" content="Anchored to the cursor" />
    </div>`,
  }),
}
