import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayLabel from './DisplayLabel.vue'

const meta = {
  title: 'Display/DisplayLabel',
  component: DisplayLabel,
  tags: ['autodocs'],
  args: { text: 'bug', color: '#d73a4a' },
} satisfies Meta<typeof DisplayLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Colored: Story = { args: { text: 'bug', color: '#d73a4a' } }
export const Muted: Story = { args: { text: 'wontfix' } }

export const GitHubLabels: Story = {
  render: () => ({
    components: { DisplayLabel },
    template: `<div class="flex flex-wrap gap-2">
      <DisplayLabel text="bug" color="#d73a4a" />
      <DisplayLabel text="enhancement" color="#a2eeef" />
      <DisplayLabel text="docs" color="#0075ca" />
      <DisplayLabel text="wontfix" />
    </div>`,
  }),
}
