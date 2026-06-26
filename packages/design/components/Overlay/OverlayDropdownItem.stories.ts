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
      <template #trigger><ActionButton icon="i-ph:gear">Actions</ActionButton></template>
      <OverlayDropdownItem icon="i-ph:folder">Open</OverlayDropdownItem>
      <OverlayDropdownItem icon="i-ph:pencil-simple">Rename</OverlayDropdownItem>
      <OverlayDropdownItem icon="i-ph:trash" disabled>Delete (disabled)</OverlayDropdownItem>
    </OverlayDropdown>`,
  }),
}
