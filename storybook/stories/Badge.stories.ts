import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Badge from '@antfu/design/components/Display/DisplayBadge.vue'

const meta = {
  title: 'Tier 1/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['subtle', 'solid'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { text: 'vite', variant: 'subtle', size: 'md' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const HashColored: Story = { args: { text: 'unocss' } }
export const Solid: Story = { args: { text: 'rolldown', variant: 'solid' } }
export const Palette: Story = { args: { text: 'esm', color: 'green' } }
export const Muted: Story = { args: { text: 'unknown', color: false } }
export const WithIcon: Story = { args: { text: 'Vue', icon: 'i-catppuccin:vue' } }

export const Gallery: Story = {
  render: () => ({
    components: { Badge },
    template: `<div class="flex flex-wrap gap-2">
      <Badge v-for="n in ['vue','react','svelte','vite','unocss','nuxt','rolldown','eslint']" :key="n" :text="n" />
    </div>`,
  }),
}

export const PaletteColors: Story = {
  render: () => ({
    components: { Badge },
    template: `<div class="flex flex-wrap gap-2">
      <Badge v-for="c in ['green','blue','amber','red','purple','teal']" :key="c" :text="c" :color="c" />
    </div>`,
  }),
}
