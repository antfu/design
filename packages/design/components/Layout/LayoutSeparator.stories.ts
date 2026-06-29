import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LayoutSeparator from './LayoutSeparator.vue'

const meta = {
  title: 'Layout/LayoutSeparator',
  component: LayoutSeparator,
  tags: ['autodocs'],
} satisfies Meta<typeof LayoutSeparator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => ({
    components: { LayoutSeparator },
    template: `<div class="text-sm"><p>Above</p><LayoutSeparator /><p>Below</p></div>`,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: { LayoutSeparator },
    template: `<div class="text-sm"><p>Section one</p><LayoutSeparator label="or" /><p>Section two</p></div>`,
  }),
}

export const Vertical: Story = {
  render: () => ({
    components: { LayoutSeparator },
    template: `<div class="text-sm h-6 flex items-center"><span>Home</span><LayoutSeparator orientation="vertical" /><span>Docs</span><LayoutSeparator orientation="vertical" /><span>About</span></div>`,
  }),
}
