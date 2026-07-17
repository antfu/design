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

export const AdaptsToColorMode: Story = {
  render: () => ({
    components: { DisplayFileIcon },
    // The icon bakes in `icon-catppuccin` (see the design preset), which
    // inverts/rehues/dims the dark-tuned catppuccin set on a light surface
    // and cancels back to native color under `.dark` — no prop needed, it
    // just tracks the ambient color mode.
    template: `<div class="flex gap-4">
      <div class="text-xl flex items-center gap-2 p-4 rounded bg-white">
        <DisplayFileIcon path="a.vue" />
        <DisplayFileIcon path="b.ts" />
        <DisplayFileIcon path="c.json" />
      </div>
      <div class="dark text-xl flex items-center gap-2 p-4 rounded bg-#111">
        <DisplayFileIcon path="a.vue" />
        <DisplayFileIcon path="b.ts" />
        <DisplayFileIcon path="c.json" />
      </div>
    </div>`,
  }),
}
