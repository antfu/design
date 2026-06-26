import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormField from './FormField.vue'
import FormTextInput from './FormTextInput.vue'

const meta = {
  title: 'Form/FormField',
  component: FormField,
  tags: ['autodocs'],
  args: { label: 'Project name' },
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { FormField, FormTextInput },
    setup() {
      return { args, text: ref('') }
    },
    template: `<div class="w-72">
      <FormField v-bind="args" id="project-name" description="Shown publicly on your profile.">
        <FormTextInput v-model="text" id="project-name" placeholder="my-awesome-lib" clearable />
      </FormField>
    </div>`,
  }),
}

export const Required: Story = {
  render: args => ({
    components: { FormField, FormTextInput },
    setup() {
      return { args, text: ref('') }
    },
    template: `<div class="w-72">
      <FormField v-bind="args" id="project-required" required description="This field is mandatory.">
        <FormTextInput v-model="text" id="project-required" placeholder="my-awesome-lib" />
      </FormField>
    </div>`,
  }),
}

export const WithError: Story = {
  render: args => ({
    components: { FormField, FormTextInput },
    setup() {
      return { args, text: ref('') }
    },
    template: `<div class="w-72">
      <FormField v-bind="args" id="project-error" required error="A project name is required.">
        <FormTextInput v-model="text" id="project-error" placeholder="my-awesome-lib" />
      </FormField>
    </div>`,
  }),
}
