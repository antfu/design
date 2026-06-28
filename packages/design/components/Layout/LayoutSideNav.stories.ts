import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import LayoutSideNav from './LayoutSideNav.vue'

// `component`/`typeof` omitted: the `v-model` + header/footer slots don't fit
// Storybook's args typing for a render-based story. The render uses it directly.
const meta = {
  title: 'Layout/LayoutSideNav',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

const items = [
  { value: 'modules', label: 'Modules', icon: 'i-catppuccin:folder' },
  { value: 'graph', label: 'Graph', icon: 'i-catppuccin:typescript' },
  { value: 'issues', label: 'Issues', icon: 'i-catppuccin:json', badge: 12 },
  { value: 'settings', label: 'Settings', icon: 'i-catppuccin:toml', disabled: true },
]

export const Default: Story = {
  render: () => ({
    components: { LayoutSideNav },
    setup() {
      const active = ref('modules')
      return { active, items }
    },
    template: `<div class="w-56 border border-base rounded-lg">
      <LayoutSideNav v-model="active" :items="items" />
    </div>`,
  }),
}
