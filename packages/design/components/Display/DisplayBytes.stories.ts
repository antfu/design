import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayBytes from './DisplayBytes.vue'

const meta = {
  title: 'Display/DisplayBytes',
  component: DisplayBytes,
  tags: ['autodocs'],
  args: { bytes: 204800 },
} satisfies Meta<typeof DisplayBytes>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { bytes: 204800 } }
export const Colorized: Story = { args: { bytes: 2097152, colorize: true } }
export const WithTotal: Story = { args: { bytes: 524288, total: 1048576 } }

export const Scale: Story = {
  render: () => ({
    components: { DisplayBytes },
    template: `<div class="flex flex-col gap-1">
      <DisplayBytes :bytes="512" colorize />
      <DisplayBytes :bytes="204800" colorize />
      <DisplayBytes :bytes="2097152" colorize />
      <DisplayBytes :bytes="524288" :total="1048576" />
    </div>`,
  }),
}
