/**
 * Opt-in color-scheme context.
 *
 * The package is stateless: most components flip light/dark automatically from
 * the `html.dark` class + `--af-*` tokens, and the handful that compute colors in
 * JS (badges/labels/proportion bars) take a `colorScheme` prop. Threading that
 * prop everywhere is tedious, so this provides an *opt-in* context: call
 * {@link provideColorScheme} once near the app root (feeding it your own
 * app-owned dark ref), and scheme-aware components fall back to it when their
 * prop is omitted. The package itself owns no state — the context only *reads* a
 * ref you pass in.
 */
import type { ComputedRef, InjectionKey, MaybeRefOrGetter, Ref } from 'vue'
import { computed, inject, provide, toRef } from 'vue'

export type ColorScheme = 'light' | 'dark'

/** Injection key for the active {@link ColorScheme}. */
export const colorSchemeKey: InjectionKey<Ref<ColorScheme>> = Symbol('antfu-design-color-scheme')

/**
 * Provide the active color scheme to descendant components (call in `setup`).
 *
 * Accepts a ref, a getter, or a plain value — pass a getter/ref bound to your own
 * dark-mode state so the context stays reactive. The package stays stateless: it
 * only reads the value you provide.
 *
 * @param scheme - The current scheme as a ref, getter, or value.
 * @returns The resolved {@link ColorScheme} ref that was provided.
 *
 * @example
 * const isDark = useDark()
 * provideColorScheme(() => isDark.value ? 'dark' : 'light')
 */
export function provideColorScheme(scheme: MaybeRefOrGetter<ColorScheme>): Ref<ColorScheme> {
  const ref = toRef(scheme) as Ref<ColorScheme>
  provide(colorSchemeKey, ref)
  return ref
}

/**
 * Resolve the effective color scheme: explicit prop → provided context → `'light'`.
 *
 * Components pass a getter for their own `colorScheme` prop so an explicit prop
 * always wins; otherwise the value from {@link provideColorScheme} is used, and
 * finally `'light'` as the default.
 *
 * @param prop - Getter for the component's own `colorScheme` prop (optional).
 * @returns A computed {@link ColorScheme}.
 *
 * @example
 * const scheme = useColorScheme(() => props.colorScheme)
 * const dark = computed(() => scheme.value === 'dark')
 */
export function useColorScheme(prop?: () => ColorScheme | undefined): ComputedRef<ColorScheme> {
  const injected = inject(colorSchemeKey, undefined)
  return computed<ColorScheme>(() => prop?.() ?? injected?.value ?? 'light')
}
