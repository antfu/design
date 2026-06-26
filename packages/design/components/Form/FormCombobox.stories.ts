import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormCombobox from './FormCombobox.vue'

const meta = {
  title: 'Form/FormCombobox',
  component: FormCombobox,
  tags: ['autodocs'],
  args: { options: [] }, // required prop; each story supplies real options via render
} satisfies Meta<typeof FormCombobox>

export default meta
type Story = StoryObj<typeof meta>

const frameworks = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular' },
  { value: 'qwik', label: 'Qwik' },
]

export const Default: Story = {
  render: () => ({
    components: { FormCombobox },
    setup() {
      return {
        value: ref('vue'),
        options: frameworks,
      }
    },
    template: `<FormCombobox v-model="value" :options="options" placeholder="Search a framework…" />`,
  }),
}
