import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormSelect from './FormSelect.vue'

const meta = {
  title: 'Form/FormSelect',
  component: FormSelect,
  tags: ['autodocs'],
  args: { options: [] }, // required prop; each story supplies real options via render
} satisfies Meta<typeof FormSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { FormSelect },
    setup() {
      return {
        value: ref('green'),
        options: [
          { value: 'green', label: 'antfu green' },
          { value: 'blue', label: 'GitHub blue' },
          { value: 'purple', label: 'Vite purple' },
        ],
      }
    },
    template: `<FormSelect v-model="value" :options="options" placeholder="Pick a theme" />`,
  }),
}

export const Empty: Story = {
  render: () => ({
    components: { FormSelect },
    setup() {
      return {
        value: ref<string>(),
        options: [
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B' },
          { value: 'c', label: 'Disabled', disabled: true },
        ],
      }
    },
    template: `<FormSelect v-model="value" :options="options" placeholder="Select…" />`,
  }),
}
