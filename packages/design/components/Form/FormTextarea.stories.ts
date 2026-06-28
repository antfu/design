import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormTextarea from './FormTextarea.vue'

const meta = {
  title: 'Form/FormTextarea',
  component: FormTextarea,
  tags: ['autodocs'],
  args: { placeholder: 'Write something…', rows: 4, resize: true },
} satisfies Meta<typeof FormTextarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { FormTextarea },
    setup() {
      return { args, text: ref('') }
    },
    template: `<div class="w-72"><FormTextarea v-bind="args" v-model="text" /></div>`,
  }),
}

export const Invalid: Story = {
  render: args => ({
    components: { FormTextarea },
    setup() {
      return { args, text: ref('Too short') }
    },
    template: `<div class="w-72"><FormTextarea v-bind="args" v-model="text" invalid /></div>`,
  }),
}

export const States: Story = {
  render: () => ({
    components: { FormTextarea },
    setup() {
      return { a: ref('Resizable by default'), b: ref('No resize handle'), c: ref('Disabled') }
    },
    template: `<div class="flex flex-col gap-3 w-72">
      <FormTextarea v-model="a" placeholder="Default" />
      <FormTextarea v-model="b" placeholder="Fixed" :resize="false" />
      <FormTextarea v-model="c" placeholder="Disabled" disabled />
    </div>`,
  }),
}
