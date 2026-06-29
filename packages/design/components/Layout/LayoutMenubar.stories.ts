import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LayoutMenubar from './LayoutMenubar.vue'

const meta = {
  title: 'Layout/LayoutMenubar',
  component: LayoutMenubar,
  tags: ['autodocs'],
  args: { menus: [] }, // required prop; each story supplies real menus via render
} satisfies Meta<typeof LayoutMenubar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { LayoutMenubar },
    setup: () => ({ menus: [
      { value: 'file', label: 'File', items: [
        { value: 'new', label: 'New', icon: 'i-ph:file', shortcut: 'mod+n' },
        { value: 'open', label: 'Open…', icon: 'i-ph:folder', shortcut: 'mod+o' },
        { value: 'quit', label: 'Quit', icon: 'i-ph:sign-out', shortcut: 'mod+q', separator: true, variant: 'danger' },
      ] },
      { value: 'edit', label: 'Edit', items: [
        { value: 'undo', label: 'Undo', shortcut: 'mod+z' },
        { value: 'redo', label: 'Redo', shortcut: 'mod+shift+z' },
      ] },
    ] }),
    template: `<LayoutMenubar :menus="menus" />`,
  }),
}
