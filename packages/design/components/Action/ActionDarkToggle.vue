<script setup lang="ts">
import { computed, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Current color scheme — the app owns this state. */
    colorScheme?: 'light' | 'dark'
    /** Disable the view-transition circular reveal. */
    animated?: boolean
  }>(),
  { colorScheme: 'light', animated: true },
)

const emit = defineEmits<{ 'update:colorScheme': ['light' | 'dark'] }>()

const isDark = computed(() => props.colorScheme === 'dark')

function prefersReducedMotion(): boolean {
  return typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion: reduce)').matches
}

function onClick(event: MouseEvent): void {
  const next = isDark.value ? 'light' : 'dark'
  const doc = document as Document & {
    startViewTransition?: (cb: () => Promise<void> | void) => { ready: Promise<void> }
  }
  const canAnimate = props.animated
    && typeof doc.startViewTransition === 'function'
    && !prefersReducedMotion()

  if (!canAnimate) {
    emit('update:colorScheme', next)
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const toDark = next === 'dark'

  const transition = doc.startViewTransition!(async () => {
    emit('update:colorScheme', next)
    await nextTick()
  })

  transition.ready.then(() => {
    const clip = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      { clipPath: toDark ? clip : [...clip].reverse() },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: toDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
      },
    )
  })
}
</script>

<template>
  <slot :is-dark="isDark" :toggle="onClick">
    <button
      type="button"
      class="btn-icon"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      :aria-pressed="isDark"
      @click="onClick"
    >
      <svg v-if="isDark" width="1.1em" height="1.1em" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26 5.4 5.4 0 0 1-5.4-5.4c0-1.81.89-3.41 2.26-4.4-.44-.06-.9-.1-1.36-.1Z"
        />
      </svg>
      <svg v-else width="1.1em" height="1.1em" viewBox="0 0 24 24" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
        </g>
      </svg>
    </button>
  </slot>
</template>
