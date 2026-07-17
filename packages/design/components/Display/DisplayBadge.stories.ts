import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayBadge from './DisplayBadge.vue'

const meta = {
  title: 'Display/DisplayBadge',
  component: DisplayBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['subtle', 'solid'] },
  },
  args: { text: 'vite', variant: 'subtle' },
} satisfies Meta<typeof DisplayBadge>

export default meta
type Story = StoryObj<typeof meta>

export const HashColored: Story = { args: { text: 'unocss' } }
export const Solid: Story = { args: { text: 'rolldown', variant: 'solid' } }
export const Palette: Story = { args: { text: 'esm', color: 'green' } }
export const Muted: Story = { args: { text: 'unknown', color: false } }
export const WithIcon: Story = { args: { text: 'stable', icon: 'i-ph:seal-check', color: 'green' } }

export const Sizes: Story = {
  render: () => ({
    components: { DisplayBadge },
    template: `<div class="flex flex-wrap items-center gap-2">
      <DisplayBadge text="micro" color="green" class="text-micro" />
      <DisplayBadge text="mini" color="green" class="text-mini" />
      <DisplayBadge text="compact" color="green" class="text-compact" />
      <DisplayBadge text="xs" color="green" class="text-xs" />
      <DisplayBadge text="sm" color="green" class="text-sm" />
      <DisplayBadge text="base" color="green" class="text-base" />
      <DisplayBadge text="lg" color="green" class="text-lg" />
    </div>`,
  }),
}

export const Gallery: Story = {
  render: () => ({
    components: { DisplayBadge },
    template: `<div class="flex flex-wrap gap-2">
      <DisplayBadge v-for="n in ['vue','react','svelte','vite','unocss','nuxt','rolldown','eslint']" :key="n" :text="n" />
    </div>`,
  }),
}

export const RoundedAndPadding: Story = {
  render: () => ({
    components: { DisplayBadge },
    template: `<div class="flex flex-wrap items-center gap-2">
      <DisplayBadge text="md (default)" color="green" />
      <DisplayBadge text="full" color="green" rounded="full" />
      <DisplayBadge text="0.75em" color="green" :rounded="0.75" />
      <DisplayBadge text="tight" color="green" rounded="full" :padding-x="0.65" :padding-y="0.15" />
      <DisplayBadge text="roomy" color="green" :padding-x="1" :padding-y="0.5" />
    </div>`,
  }),
}
