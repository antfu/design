import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayKbd from './DisplayKbd.vue'

const meta = {
  title: 'Display/DisplayKbd',
  component: DisplayKbd,
  tags: ['autodocs'],
  args: { keys: 'mod+k' },
} satisfies Meta<typeof DisplayKbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { keys: 'mod+k' } }
export const Chord: Story = { args: { keys: 'g g' } }

export const Bindings: Story = {
  render: () => ({
    components: { DisplayKbd },
    template: `<div class="flex items-center gap-3">
      <DisplayKbd keys="mod+k" />
      <DisplayKbd keys="shift+?" />
      <DisplayKbd keys="g g" />
    </div>`,
  }),
}
