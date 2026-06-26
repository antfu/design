import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayFilePath from './DisplayFilePath.vue'

const meta = {
  title: 'Display/DisplayFilePath',
  component: DisplayFilePath,
  tags: ['autodocs'],
  args: { path: '/project/src/components/Badge.vue', root: '/project' },
} satisfies Meta<typeof DisplayFilePath>

export default meta
type Story = StoryObj<typeof meta>

export const WithRoot: Story = {
  args: { path: '/project/src/components/Badge.vue', root: '/project' },
}

export const Module: Story = {
  args: { path: '/project/node_modules/.pnpm/vue@3.5.0/node_modules/vue/dist/vue.mjs' },
}

export const Examples: Story = {
  render: () => ({
    components: { DisplayFilePath },
    template: `<div class="flex flex-col gap-2 max-w-md">
      <DisplayFilePath path="/project/src/components/Badge.vue" root="/project" />
      <DisplayFilePath path="/project/node_modules/.pnpm/vue@3.5.0/node_modules/vue/dist/vue.mjs" />
    </div>`,
  }),
}
