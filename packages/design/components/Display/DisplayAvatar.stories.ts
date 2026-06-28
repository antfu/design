import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayAvatar from './DisplayAvatar.vue'

const meta = {
  title: 'Display/DisplayAvatar',
  component: DisplayAvatar,
  tags: ['autodocs'],
  args: { name: 'Anthony Fu', size: 32 },
} satisfies Meta<typeof DisplayAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  args: { src: 'https://github.com/antfu.png', name: 'Anthony Fu' },
}

export const InitialsFallback: Story = {
  args: { name: 'Anthony Fu' },
}

export const Square: Story = {
  args: { name: 'Vite Press', square: true, size: 48 },
}

export const Gallery: Story = {
  render: () => ({
    components: { DisplayAvatar },
    setup() {
      return { names: ['Vue', 'React Native', 'svelte-kit', 'unocss', 'Anthony Fu', 'esbuild'] }
    },
    template: `<div class="flex flex-wrap gap-2 items-center">
      <DisplayAvatar v-for="n in names" :key="n" :name="n" :size="40" />
    </div>`,
  }),
}
