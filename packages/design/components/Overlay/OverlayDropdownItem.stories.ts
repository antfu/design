import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ActionButton from '../Action/ActionButton.vue'
import OverlayDropdown from './OverlayDropdown.vue'
import OverlayDropdownItem from './OverlayDropdownItem.vue'

const meta = {
  title: 'Overlay/OverlayDropdownItem',
  component: OverlayDropdownItem,
  tags: ['autodocs'],
} satisfies Meta<typeof OverlayDropdownItem>

export default meta
type Story = StoryObj<typeof meta>

// DropdownItem only renders meaningfully inside a Dropdown menu.
export const InDropdown: Story = {
  render: () => ({
    components: { OverlayDropdown, OverlayDropdownItem, ActionButton },
    template: `<OverlayDropdown>
      <template #trigger><ActionButton icon="i-catppuccin:settings">Actions</ActionButton></template>
      <OverlayDropdownItem icon="i-catppuccin:folder">Open</OverlayDropdownItem>
      <OverlayDropdownItem icon="i-catppuccin:typescript">Rename</OverlayDropdownItem>
      <OverlayDropdownItem icon="i-catppuccin:trash" disabled>Delete (disabled)</OverlayDropdownItem>
    </OverlayDropdown>`,
  }),
}
