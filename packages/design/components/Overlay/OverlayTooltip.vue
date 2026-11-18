<!-- @description a native tooltip (Popover API + CSS anchor positioning) — text `content` or the `#content` slot, configurable `placement`/`delay`/`triggers`, plus a virtual-anchor mode for canvas/graph overlays. -->
<script setup lang="ts">
import type { TooltipHandle, TooltipPlacement, TooltipTrigger } from '../../composables/tooltip'
import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import { bindTooltip } from '../../composables/tooltip'

const props = withDefaults(
  defineProps<{
    /** Tooltip text (use the `content` slot for rich content). */
    content?: string
    placement?: TooltipPlacement
    distance?: number
    /** Show/hide delay in ms, or `{ show, hide }`. */
    delay?: number | { show?: number, hide?: number }
    /** What triggers the tooltip, e.g. `['hover', 'focus']` or `['click']`. */
    triggers?: TooltipTrigger[]
    /** Programmatic open state (bypasses triggers when set). */
    shown?: boolean
    /**
     * Anchor the popover to an arbitrary viewport coordinate instead of a
     * trigger element — for floating popovers over a canvas/graph. Pair with
     * `shown` to control visibility programmatically (triggers default to none).
     */
    anchor?: { x: number, y: number }
    disabled?: boolean
  }>(),
  { placement: 'top', distance: 6, shown: undefined },
)

const wrapper = useTemplateRef<HTMLElement>('wrapper')
const point = useTemplateRef<HTMLElement>('point')
const popover = useTemplateRef<HTMLElement>('popover')

const anchorStyle = computed(() =>
  props.anchor
    ? { position: 'fixed' as const, left: `${props.anchor.x}px`, top: `${props.anchor.y}px`, width: '0', height: '0' }
    : undefined,
)

// `shown` bypasses triggers. A coordinate anchor has no hoverable element, so
// it defaults to manual control too, unless the caller passes `triggers`.
const triggers = computed<TooltipTrigger[] | undefined>(() =>
  props.shown !== undefined ? [] : props.triggers ?? (props.anchor ? [] : undefined))

let handle: TooltipHandle | undefined

function bind(): void {
  handle?.dispose()
  const anchorEl = props.anchor ? point.value : wrapper.value
  if (!anchorEl || !popover.value)
    return
  handle = bindTooltip(anchorEl, popover.value, () => ({
    placement: props.placement,
    distance: props.distance,
    delay: props.delay,
    triggers: triggers.value,
    disabled: props.disabled,
  }))
  if (props.shown && !props.disabled)
    handle.show()
}

onMounted(bind)
// The anchor element swaps between the wrapper and the coordinate marker.
watch(() => !!props.anchor, bind, { flush: 'post' })
watch(() => props.shown && !props.disabled, show => show ? handle?.show() : handle?.hide())
watch(() => props.disabled, disabled => disabled && handle?.hide())
onBeforeUnmount(() => handle?.dispose())
</script>

<template>
  <div ref="wrapper">
    <span v-if="anchor" ref="point" :style="anchorStyle" aria-hidden="true" />
    <slot v-else />
    <div ref="popover">
      <slot name="content">
        {{ content }}
      </slot>
    </div>
  </div>
</template>
