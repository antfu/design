import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormCheckbox from './FormCheckbox.vue'

const meta = {
  title: 'Form/FormCheckbox',
  component: FormCheckbox,
  tags: ['autodocs'],
} satisfies Meta<typeof FormCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { FormCheckbox },
    setup() {
      return { checked: ref(true) }
    },
    template: `<FormCheckbox v-model="checked" label="Enable telemetry" />`,
  }),
}

export const States: Story = {
  render: () => ({
    components: { FormCheckbox },
    setup() {
      return { a: ref(true), b: ref(false), c: ref(true) }
    },
    template: `<div class="flex flex-col gap-3">
      <FormCheckbox v-model="a" label="Checked" />
      <FormCheckbox v-model="b" label="Unchecked" />
      <FormCheckbox v-model="c" label="Disabled" disabled />
    </div>`,
  }),
}
