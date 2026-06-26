import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from '@antfu/design/components/Action/ActionButton.vue'
import DarkToggle from '@antfu/design/components/Action/ActionDarkToggle.vue'
import IconButton from '@antfu/design/components/Action/ActionIconButton.vue'
import Loading from '@antfu/design/components/Feedback/FeedbackLoading.vue'
import Spinner from '@antfu/design/components/Feedback/FeedbackSpinner.vue'
import { ref } from 'vue'

const meta = {
  title: 'Tier 1/Buttons',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => ({
    components: { Button },
    template: `<div class="flex items-center gap-3">
      <Button>Action</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="text">Text</Button>
      <Button :loading="true">Loading</Button>
      <Button :disabled="true">Disabled</Button>
    </div>`,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Button },
    template: `<div class="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
    </div>`,
  }),
}

export const IconButtons: Story = {
  render: () => ({
    components: { IconButton },
    template: `<div class="flex items-center gap-2">
      <IconButton icon="i-catppuccin:folder" tooltip="Open folder" />
      <IconButton icon="i-catppuccin:settings" tooltip="Settings" :active="true" />
      <IconButton icon="i-catppuccin:trash" tooltip="Delete" :disabled="true" />
    </div>`,
  }),
}

export const Spinners: Story = {
  render: () => ({
    components: { Spinner, Loading },
    template: `<div class="flex items-center gap-6">
      <Spinner />
      <Spinner size="24" />
      <Loading text="Loading data…" />
    </div>`,
  }),
}

export const Dark: Story = {
  render: () => ({
    components: { DarkToggle },
    setup() {
      // The app owns the scheme; the toggle is controlled.
      const colorScheme = ref<'light' | 'dark'>(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      )
      function onUpdate(value: 'light' | 'dark'): void {
        colorScheme.value = value
        document.documentElement.classList.toggle('dark', value === 'dark')
      }
      return { colorScheme, onUpdate }
    },
    template: `<DarkToggle :color-scheme="colorScheme" @update:color-scheme="onUpdate" />`,
  }),
}
