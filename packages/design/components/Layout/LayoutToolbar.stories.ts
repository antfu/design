import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import ActionIconButton from '../Action/ActionIconButton.vue'
import FormSearchField from '../Form/FormSearchField.vue'
import LayoutToolbar from './LayoutToolbar.vue'

const meta = {
  title: 'Layout/LayoutToolbar',
  component: LayoutToolbar,
  tags: ['autodocs'],
  argTypes: {
    sticky: { control: 'boolean' },
    glass: { control: 'boolean' },
  },
  args: { sticky: true, glass: true },
} satisfies Meta<typeof LayoutToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { LayoutToolbar, ActionIconButton, FormSearchField },
    setup() {
      return { search: ref('') }
    },
    template: `<div class="border border-base rounded-lg w-full overflow-hidden">
      <LayoutToolbar>
        <template #start>
          <span class="i-catppuccin:folder-app text-lg" aria-hidden="true" />
          <span class="text-sm color-base font-medium">Project</span>
        </template>
        <template #search>
          <FormSearchField v-model="search" placeholder="Search files…" />
        </template>
        <template #end>
          <ActionIconButton icon="i-catppuccin:folder-config" tooltip="Settings" />
          <ActionIconButton icon="i-catppuccin:git" tooltip="Repository" />
        </template>
      </LayoutToolbar>
      <div class="text-sm color-muted p-4">Page content…</div>
    </div>`,
  }),
}

export const Opaque: Story = {
  render: () => ({
    components: { LayoutToolbar, ActionIconButton },
    template: `<div class="border border-base rounded-lg w-full overflow-hidden">
      <LayoutToolbar :glass="false" :sticky="false">
        <template #start>
          <span class="text-sm color-base font-medium">Dashboard</span>
        </template>
        <template #end>
          <ActionIconButton icon="i-catppuccin:folder-config" tooltip="Settings" />
        </template>
      </LayoutToolbar>
    </div>`,
  }),
}
