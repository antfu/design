import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ActionButton from '../Action/ActionButton.vue'
import OverlayDropdown from './OverlayDropdown.vue'
import OverlayDropdownItem from './OverlayDropdownItem.vue'

const meta = {
  title: 'Overlay/OverlayDropdown',
  component: OverlayDropdown,
  tags: ['autodocs'],
} satisfies Meta<typeof OverlayDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { OverlayDropdown, OverlayDropdownItem, ActionButton },
    template: `<OverlayDropdown>
      <template #trigger><ActionButton icon="i-ph:gear">Menu</ActionButton></template>
      <OverlayDropdownItem icon="i-ph:folder">Open</OverlayDropdownItem>
      <OverlayDropdownItem icon="i-ph:pencil-simple">Rename</OverlayDropdownItem>
      <OverlayDropdownItem icon="i-ph:trash">Delete</OverlayDropdownItem>
    </OverlayDropdown>`,
  }),
}
