import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ProportionSegment } from './DisplayProportionBar.vue'
import DisplayProportionBar from './DisplayProportionBar.vue'

const meta = {
  title: 'Display/DisplayProportionBar',
  component: DisplayProportionBar,
  tags: ['autodocs'],
  args: { segments: [] }, // required prop; stories supply their own via render
} satisfies Meta<typeof DisplayProportionBar>

export default meta
type Story = StoryObj<typeof meta>

const segments: ProportionSegment[] = [
  { value: 60, label: 'JavaScript', color: '#f1e05a' },
  { value: 30, label: 'TypeScript', color: '#3178c6' },
  { value: 10, label: 'CSS', color: '#563d7c' },
]

export const Default: Story = {
  args: { segments, height: 12 },
  decorators: [() => ({ template: '<div class="w-80"><story /></div>' })],
}

export const HashColored: Story = {
  render: () => ({
    components: { DisplayProportionBar },
    setup() {
      return {
        segments: [
          { value: 5, label: 'vue' },
          { value: 3, label: 'react' },
          { value: 2, label: 'svelte' },
        ] as ProportionSegment[],
      }
    },
    template: `<div class="w-80"><DisplayProportionBar :segments="segments" :height="12" /></div>`,
  }),
}
