import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayVersion from './DisplayVersion.vue'

const meta = {
  title: 'Display/DisplayVersion',
  component: DisplayVersion,
  tags: ['autodocs'],
  args: { version: '1.2.3' },
} satisfies Meta<typeof DisplayVersion>

export default meta
type Story = StoryObj<typeof meta>

export const WithPrefix: Story = { args: { version: '1.2.3' } }
export const NoPrefix: Story = { args: { version: 'v0.1.0', prefix: false } }

export const Examples: Story = {
  render: () => ({
    components: { DisplayVersion },
    template: `<div class="flex gap-3">
      <DisplayVersion version="1.2.3" />
      <DisplayVersion version="v0.1.0" :prefix="false" />
    </div>`,
  }),
}
