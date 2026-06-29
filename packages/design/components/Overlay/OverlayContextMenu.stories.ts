import type { Meta, StoryObj } from '@storybook/vue3-vite'
import OverlayContextMenu from './OverlayContextMenu.vue'
import OverlayContextMenuItem from './OverlayContextMenuItem.vue'
import OverlayContextMenuLabel from './OverlayContextMenuLabel.vue'
import OverlayContextMenuSeparator from './OverlayContextMenuSeparator.vue'

const meta = {
  title: 'Overlay/OverlayContextMenu',
  component: OverlayContextMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof OverlayContextMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { OverlayContextMenu, OverlayContextMenuItem, OverlayContextMenuLabel, OverlayContextMenuSeparator },
    template: `<OverlayContextMenu>
      <template #trigger>
        <div class="h-32 grid place-items-center border border-base rounded-lg border-dashed color-faint text-sm select-none">Right-click here</div>
      </template>
      <OverlayContextMenuLabel>Actions</OverlayContextMenuLabel>
      <OverlayContextMenuItem icon="i-ph:copy" shortcut="mod+c">Copy</OverlayContextMenuItem>
      <OverlayContextMenuItem icon="i-ph:scissors" shortcut="mod+x">Cut</OverlayContextMenuItem>
      <OverlayContextMenuSeparator />
      <OverlayContextMenuItem icon="i-ph:trash" variant="danger" shortcut="del">Delete</OverlayContextMenuItem>
    </OverlayContextMenu>`,
  }),
}
