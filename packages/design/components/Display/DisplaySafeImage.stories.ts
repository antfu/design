import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplaySafeImage from './DisplaySafeImage.vue'

const meta = {
  title: 'Display/DisplaySafeImage',
  component: DisplaySafeImage,
  tags: ['autodocs'],
  args: { alt: 'avatar' },
  decorators: [() => ({ template: '<div class="w-16 h-16 border border-base rounded overflow-hidden"><story /></div>' })],
} satisfies Meta<typeof DisplaySafeImage>

export default meta
type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  args: { src: 'https://github.com/antfu.png' },
}

export const BrokenSrc: Story = {
  render: () => ({
    components: { DisplaySafeImage },
    template: `<DisplaySafeImage src="https://example.com/does-not-exist.png" alt="broken">
      <template #fallback>
        <div class="w-full h-full bg-secondary color-muted text-xs inline-flex items-center justify-center">
          fallback
        </div>
      </template>
    </DisplaySafeImage>`,
  }),
}

export const NoSrc: Story = {
  render: () => ({
    components: { DisplaySafeImage },
    template: `<DisplaySafeImage>
      <template #fallback>
        <div class="w-full h-full bg-secondary color-muted text-xs inline-flex items-center justify-center">
          no src
        </div>
      </template>
    </DisplaySafeImage>`,
  }),
}
