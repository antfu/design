import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormSearchField from './FormSearchField.vue'

const meta = {
  title: 'Form/FormSearchField',
  component: FormSearchField,
  tags: ['autodocs'],
} satisfies Meta<typeof FormSearchField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { FormSearchField },
    setup() {
      return { search: ref('') }
    },
    template: `<div class="w-72"><FormSearchField v-model="search" shortcut="mod+k" /></div>`,
  }),
}
