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

export const Directory: Story = {
  render: () => ({
    components: { DisplayFileIcon },
    template: `<div class="text-xl flex items-center gap-2">
      <DisplayFileIcon path="src" directory />
      <DisplayFileIcon path="src" directory open />
      <DisplayFileIcon path="node_modules" directory />
    </div>`,
  }),
}

export const Inverted: Story = {
  render: () => ({
    components: { DisplayFileIcon },
    // `invert` flips icon luminance so a dark-designed set stays legible on light surfaces.
    template: `<div class="text-xl flex items-center gap-2">
      <DisplayFileIcon path="a.vue" />
      <DisplayFileIcon path="a.vue" invert />
    </div>`,
  }),
}
