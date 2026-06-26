import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayBadge from './DisplayBadge.vue'

const meta = {
  title: 'Display/DisplayBadge',
  component: DisplayBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['subtle', 'solid'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { text: 'vite', variant: 'subtle', size: 'md' },
} satisfies Meta<typeof DisplayBadge>

export default meta
type Story = StoryObj<typeof meta>

export const HashColored: Story = { args: { text: 'unocss' } }
export const Solid: Story = { args: { text: 'rolldown', variant: 'solid' } }
export const Palette: Story = { args: { text: 'esm', color: 'green' } }
export const Muted: Story = { args: { text: 'unknown', color: false } }
export const WithIcon: Story = { args: { text: 'stable', icon: 'i-ph:seal-check', color: 'green' } }

export const Gallery: Story = {
  render: () => ({
    components: { DisplayBadge },
    template: `<div class="flex flex-wrap gap-2">
      <DisplayBadge v-for="n in ['vue','react','svelte','vite','unocss','nuxt','rolldown','eslint']" :key="n" :text="n" />
    </div>`,
  }),
}
