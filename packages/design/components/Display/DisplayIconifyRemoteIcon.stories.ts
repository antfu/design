import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayIconifyRemoteIcon from './DisplayIconifyRemoteIcon.vue'

const meta = {
  title: 'Display/DisplayIconifyRemoteIcon',
  component: DisplayIconifyRemoteIcon,
  tags: ['autodocs'],
  args: { icon: 'catppuccin:vue' },
  parameters: {
    docs: {
      description: {
        component: 'Fetches SVG markup live from api.iconify.design for any `collection:icon` pair — unlike `DisplayFileIcon`, no matching `@iconify-json/*` package needs to be installed. Requires network access; falls back to blank on a failed fetch.',
      },
    },
  },
} satisfies Meta<typeof DisplayIconifyRemoteIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { icon: 'catppuccin:vue' } }

export const ByCollection: Story = {
  render: () => ({
    components: { DisplayIconifyRemoteIcon },
    template: `<div class="text-2xl flex items-center gap-3">
      <DisplayIconifyRemoteIcon icon="catppuccin:vue" />
      <DisplayIconifyRemoteIcon icon="catppuccin:typescript" />
      <DisplayIconifyRemoteIcon icon="ph:heart" />
      <DisplayIconifyRemoteIcon icon="i-ph:star" />
    </div>`,
  }),
}

export const UrlFallback: Story = {
  args: { icon: 'https://api.iconify.design/catppuccin/npm.svg' },
}
