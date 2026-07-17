# Recipes

Small compositions the package deliberately does **not** ship as components —
build them from the primitives plus your own (VueUse-owned) state.

## Dark-mode toggle

The package owns no dark state and ships no toggle component. Compose
`ActionIconButton` with VueUse's `useDark`/`useToggle`:

```vue
<script setup lang="ts">
import ActionIconButton from '@antfu/design/components/Action/ActionIconButton.vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <ActionIconButton
    :icon="isDark ? 'i-ph:sun-duotone' : 'i-ph:moon-duotone'"
    :tooltip="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleDark()"
  />
</template>
```

The `tooltip` doubles as the accessible label, so it flips with the state — no
extra `aria-*` needed. If several scheme-aware components (`DisplayBadge`,
`DisplayLabel`, …) sit under this toggle, provide the scheme once at the root so
they inherit it instead of threading a prop:

```ts
import { provideColorScheme } from '@antfu/design/composables/colorScheme'
provideColorScheme(() => (isDark.value ? 'dark' : 'light'))
```
