import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LayoutAccordion from './LayoutAccordion.vue'

const meta = {
  title: 'Layout/LayoutAccordion',
  component: LayoutAccordion,
  tags: ['autodocs'],
  args: { items: [] }, // required prop; each story supplies real items via render
} satisfies Meta<typeof LayoutAccordion>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  { value: 'general', title: 'General', icon: 'i-ph:gear', text: 'Workspace name, language, theme.' },
  { value: 'editor', title: 'Editor', icon: 'i-ph:code', text: 'Tab size, formatting, key bindings.' },
  { value: 'advanced', title: 'Advanced', icon: 'i-ph:flask', text: 'Experimental flags.' },
]

export const Single: Story = {
  render: () => ({
    components: { LayoutAccordion },
    setup: () => ({ items }),
    template: `<LayoutAccordion :items="items" class="w-80" />`,
  }),
}

export const Multiple: Story = {
  render: () => ({
    components: { LayoutAccordion },
    setup: () => ({ items }),
    template: `<LayoutAccordion :items="items" multiple class="w-80" />`,
  }),
}
