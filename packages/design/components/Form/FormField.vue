<!-- @description wraps a control with a `label`, `description`, and `error` (role="alert"), `required` marker. -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Visible field label. Overridable via the `#label` slot. */
    label?: string
    /** Helper text shown below the control. Overridable via the `#description` slot. */
    description?: string
    /** Error message shown below the control (with `role="alert"`). Overridable via the `#error` slot. */
    error?: string
    /** Show a red `*` marker after the label. */
    required?: boolean
    /** Associates the `<label>` with a control via its `id`. */
    id?: string
  }>(),
  {},
)
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label || $slots.label" :for="id" class="text-sm color-base font-medium">
      <slot name="label">{{ label }}<span v-if="required" class="text-red-500" aria-hidden="true">&nbsp;*</span></slot>
    </label>
    <slot />
    <p v-if="description || $slots.description" class="text-sm color-faint">
      <slot name="description">
        {{ description }}
      </slot>
    </p>
    <p v-if="error || $slots.error" role="alert" class="text-sm text-red-600 dark:text-red-400">
      <slot name="error">
        {{ error }}
      </slot>
    </p>
  </div>
</template>
