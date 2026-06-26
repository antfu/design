import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BytesDisplay from '@antfu/design/components/Display/DisplayBytes.vue'
import DateDisplay from '@antfu/design/components/Display/DisplayDate.vue'
import DurationDisplay from '@antfu/design/components/Display/DisplayDuration.vue'
import NumberDisplay from '@antfu/design/components/Display/DisplayNumber.vue'
import NumberBadge from '@antfu/design/components/Display/DisplayNumberBadge.vue'

const meta = {
  title: 'Tier 1/Data Display',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Numbers: Story = {
  render: () => ({
    components: { NumberDisplay, NumberBadge },
    template: `<div class="flex flex-col gap-2 font-sans">
      <div><NumberDisplay :value="1234567" /></div>
      <div><NumberDisplay :value="42" suffix="ms" /></div>
      <div><NumberDisplay :value="0.42" :options="{ style: 'percent' }" /></div>
      <div><NumberBadge :value="128" prefix="×" /></div>
    </div>`,
  }),
}

export const Durations: Story = {
  render: () => ({
    components: { DurationDisplay },
    template: `<div class="flex flex-col gap-1">
      <DurationDisplay :ms="12" colorize />
      <DurationDisplay :ms="180" colorize />
      <DurationDisplay :ms="750" colorize />
      <DurationDisplay :ms="3200" colorize />
      <DurationDisplay :ms="9000" colorize />
    </div>`,
  }),
}

export const Bytes: Story = {
  render: () => ({
    components: { BytesDisplay },
    template: `<div class="flex flex-col gap-1">
      <BytesDisplay :bytes="512" colorize />
      <BytesDisplay :bytes="204800" colorize />
      <BytesDisplay :bytes="2097152" colorize />
      <BytesDisplay :bytes="524288" :total="1048576" />
    </div>`,
  }),
}

export const Dates: Story = {
  render: () => ({
    components: { DateDisplay },
    setup() {
      const now = Date.now()
      return {
        recent: now - 1000 * 60 * 5,
        old: now - 1000 * 60 * 60 * 24 * 400,
      }
    },
    template: `<div class="flex flex-col gap-1">
      <DateDisplay :date="recent" colorize />
      <DateDisplay :date="old" colorize />
    </div>`,
  }),
}
