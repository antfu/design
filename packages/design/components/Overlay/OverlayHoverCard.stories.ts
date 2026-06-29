import type { Meta, StoryObj } from '@storybook/vue3-vite'
import OverlayHoverCard from './OverlayHoverCard.vue'

const meta = {
  title: 'Overlay/OverlayHoverCard',
  component: OverlayHoverCard,
  tags: ['autodocs'],
} satisfies Meta<typeof OverlayHoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { OverlayHoverCard },
    template: `<OverlayHoverCard>
      <template #trigger><a class="color-active underline cursor-default">@antfu</a></template>
      <div class="flex gap-3">
        <div class="i-ph:user-circle text-3xl color-faint" />
        <div>
          <div class="font-medium">Anthony Fu</div>
          <div class="op-fade">A fanatical open sourceror.</div>
        </div>
      </div>
    </OverlayHoverCard>`,
  }),
}
