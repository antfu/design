import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayPackageName from './DisplayPackageName.vue'

const meta = {
  title: 'Display/DisplayPackageName',
  component: DisplayPackageName,
  tags: ['autodocs'],
  args: { name: '@antfu/design' },
} satisfies Meta<typeof DisplayPackageName>

export default meta
type Story = StoryObj<typeof meta>

export const Scoped: Story = { args: { name: '@antfu/design' } }
export const Unscoped: Story = { args: { name: 'unocss' } }

export const Examples: Story = {
  render: () => ({
    components: { DisplayPackageName },
    template: `<div class="flex gap-3">
      <DisplayPackageName name="@antfu/design" />
      <DisplayPackageName name="@vueuse/core" />
      <DisplayPackageName name="unocss" />
    </div>`,
  }),
}

export const Namespace: Story = {
  render: () => ({
    components: { DisplayPackageName },
    // `namespace` controls how the `@scope/` prefix renders: color · dim · hide.
    template: `<div class="flex flex-col gap-1">
      <DisplayPackageName name="@antfu/design" namespace="color" />
      <DisplayPackageName name="@antfu/design" namespace="dim" />
      <DisplayPackageName name="@antfu/design" namespace="hide" />
    </div>`,
  }),
}
