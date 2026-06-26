import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayFileIcon from './DisplayFileIcon.vue'

const meta = {
  title: 'Display/DisplayFileIcon',
  component: DisplayFileIcon,
  tags: ['autodocs'],
  args: { path: 'a.vue' },
} satisfies Meta<typeof DisplayFileIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { path: 'component.vue' } }

export const ByType: Story = {
  render: () => ({
    components: { DisplayFileIcon },
    template: `<div class="text-xl flex items-center gap-2">
      <DisplayFileIcon path="a.vue" />
      <DisplayFileIcon path="b.ts" />
      <DisplayFileIcon path="c.json" />
      <DisplayFileIcon path="d.css" />
      <DisplayFileIcon path="e.md" />
    </div>`,
  }),
}
