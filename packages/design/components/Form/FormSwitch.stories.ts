import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormSwitch from './FormSwitch.vue'

const meta = {
  title: 'Form/FormSwitch',
  component: FormSwitch,
  tags: ['autodocs'],
} satisfies Meta<typeof FormSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { FormSwitch },
    setup() {
      return { on: ref(true) }
    },
    template: `<FormSwitch v-model="on" label="Dark surfaces" />`,
  }),
}

export const States: Story = {
  render: () => ({
    components: { FormSwitch },
    setup() {
      return { a: ref(true), b: ref(false), c: ref(false) }
    },
    template: `<div class="flex flex-col gap-3">
      <FormSwitch v-model="a" label="On" />
      <FormSwitch v-model="b" label="Off" />
      <FormSwitch v-model="c" label="Disabled" disabled />
    </div>`,
  }),
}
