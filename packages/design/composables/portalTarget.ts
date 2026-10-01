/**
 * Teleport target for portaled overlays inside a shadow root.
 *
 * reka-ui teleports overlay content to `document.body` by default, which is
 * outside the shadow root that holds the injected stylesheet — so a popup
 * mounted via `defineCustomElement` renders unstyled and outside the tree it
 * belongs to. This resolves a target that keeps the overlay inside the root:
 * an explicit `to` wins, otherwise a container appended to the enclosing
 * `ShadowRoot` (when there is one), otherwise `undefined` so reka falls back to
 * its own `ConfigProvider`/`body` resolution unchanged.
 *
 * The container also mirrors the `dark`/`light` class of the component's
 * nearest scheme wrapper: `dark:` utilities compile to a descendant selector
 * (`.dark .x`), and a child of the `ShadowRoot` has no `.dark` ancestor of its
 * own.
 */
import type { ComputedRef } from 'vue'
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, shallowRef } from 'vue'

/**
 * Resolve the teleport target for the calling component's portal.
 *
 * Call it in `setup`: the enclosing {@link ShadowRoot} is detected from the
 * component's own root node once mounted.
 *
 * @param explicit - Getter for a caller-provided `to` override.
 * @returns The target to pass to reka's `*Portal` (or `<Teleport>`) `to` prop.
 */
export function usePortalTarget(
  explicit?: () => string | HTMLElement | undefined,
): ComputedRef<string | HTMLElement | undefined> {
  const instance = getCurrentInstance()
  const container = shallowRef<HTMLElement>()
  let observer: MutationObserver | undefined

  onMounted(() => {
    // For fragment/teleport roots `$el` is Vue's placeholder node, which still
    // sits in the component's own tree — enough to find the root.
    const el: Node | undefined = instance?.proxy?.$el
    const root = el?.getRootNode()
    if (!(root instanceof ShadowRoot))
      return

    const target = document.createElement('div')
    root.append(target)
    container.value = target

    const scheme = (el instanceof Element ? el : el?.parentElement)?.closest('.dark, .light')
    if (scheme) {
      const sync = (): void => {
        target.className = scheme.classList.contains('dark') ? 'dark' : 'light'
      }
      sync()
      observer = new MutationObserver(sync)
      observer.observe(scheme, { attributeFilter: ['class'] })
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    container.value?.remove()
    container.value = undefined
  })

  return computed(() => explicit?.() ?? container.value)
}
