import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import ActionButton from '../Action/ActionButton.vue'
import OverlayDropdown from './OverlayDropdown.vue'
import OverlayDropdownCheckboxItem from './OverlayDropdownCheckboxItem.vue'
import OverlayDropdownGroup from './OverlayDropdownGroup.vue'
import OverlayDropdownItem from './OverlayDropdownItem.vue'
import OverlayDropdownRadioGroup from './OverlayDropdownRadioGroup.vue'
import OverlayDropdownRadioItem from './OverlayDropdownRadioItem.vue'
import OverlayDropdownSeparator from './OverlayDropdownSeparator.vue'
import OverlayDropdownSub from './OverlayDropdownSub.vue'

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

export const Structured: Story = {
  render: () => ({
    components: {
      OverlayDropdown,
      OverlayDropdownItem,
      OverlayDropdownGroup,
      OverlayDropdownCheckboxItem,
      OverlayDropdownRadioGroup,
      OverlayDropdownRadioItem,
      OverlayDropdownSub,
      OverlayDropdownSeparator,
      ActionButton,
    },
    setup() {
      return { wrap: ref(true), minimap: ref(false), density: ref('comfortable') }
    },
    template: `<OverlayDropdown>
      <template #trigger><ActionButton icon="i-ph:gear">View</ActionButton></template>
      <OverlayDropdownGroup label="Editor">
        <OverlayDropdownCheckboxItem v-model="wrap" shortcut="alt+z">Word wrap</OverlayDropdownCheckboxItem>
        <OverlayDropdownCheckboxItem v-model="minimap">Minimap</OverlayDropdownCheckboxItem>
      </OverlayDropdownGroup>
      <OverlayDropdownSeparator />
      <OverlayDropdownGroup label="Density">
        <OverlayDropdownRadioGroup v-model="density">
          <OverlayDropdownRadioItem value="comfortable">Comfortable</OverlayDropdownRadioItem>
          <OverlayDropdownRadioItem value="compact">Compact</OverlayDropdownRadioItem>
        </OverlayDropdownRadioGroup>
      </OverlayDropdownGroup>
      <OverlayDropdownSeparator />
      <OverlayDropdownSub label="Copy as" icon="i-ph:copy">
        <OverlayDropdownItem>JSON</OverlayDropdownItem>
        <OverlayDropdownItem>YAML</OverlayDropdownItem>
      </OverlayDropdownSub>
      <OverlayDropdownItem icon="i-ph:trash" variant="danger" shortcut="mod+backspace">Delete</OverlayDropdownItem>
    </OverlayDropdown>`,
  }),
}
