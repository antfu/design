import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import ActionDarkToggle from './ActionDarkToggle.vue'

const meta = {
  title: 'Action/ActionDarkToggle',
  component: ActionDarkToggle,
  tags: ['autodocs'],
} satisfies Meta<typeof ActionDarkToggle>

export default meta
type Story = StoryObj<typeof meta>

// The component is controlled: the app owns the `colorScheme` and reacts to
// `@update:color-scheme`. Here a local ref also toggles the document class.
export const Default: Story = {
  render: () => ({
    components: { ActionDarkToggle },
    setup() {
      const colorScheme = ref<'light' | 'dark'>(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      )
      function onUpdate(value: 'light' | 'dark'): void {
        colorScheme.value = value
        document.documentElement.classList.toggle('dark', value === 'dark')
      }
      return { colorScheme, onUpdate }
    },
    template: `<ActionDarkToggle :color-scheme="colorScheme" @update:color-scheme="onUpdate" />`,
  }),
}
