/**
 * Teleport target for portaled overlays inside a shadow root.
 *
 * reka-ui teleports overlay content to `document.body` by default, which is
 * outside the shadow root that holds the injected stylesheet — so a modal
 * mounted via `defineCustomElement` renders unstyled and outside the tree it
 * belongs to. This resolves a target that keeps the overlay inside the root:
 * an explicit `to` wins, otherwise a container appended to the enclosing
 * `ShadowRoot` (when there is one), otherwise `undefined` so reka falls back to
 * its own `ConfigProvider`/`body` resolution unchanged.
 */
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, onBeforeUnmount, onMounted, shallowRef, toValue } from 'vue'

/**
 * Resolve the teleport target for an overlay's portal.
 *
 * @param anchor - An element rendered in the component's normal tree (not the
 * portaled content), used to detect the enclosing {@link ShadowRoot}.
 * @param explicit - Getter for a caller-provided `to` override.
 * @returns The target to pass to reka's `*Portal` `to` prop.
 */
export function usePortalTarget(
  anchor: MaybeRefOrGetter<Element | null | undefined>,
  explicit?: () => string | HTMLElement | undefined,
): ComputedRef<string | HTMLElement | undefined> {
  const container = shallowRef<HTMLElement>()

  onMounted(() => {
    const root = toValue(anchor)?.getRootNode()
    if (root instanceof ShadowRoot) {
      container.value = document.createElement('div')
      root.append(container.value)
    }
  })

  onBeforeUnmount(() => {
    container.value?.remove()
    container.value = undefined
  })

  return computed(() => explicit?.() ?? container.value)
}
