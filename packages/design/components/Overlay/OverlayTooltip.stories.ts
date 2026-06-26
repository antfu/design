import type { Meta, StoryObj } from '@storybook/vue3-vite'
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
