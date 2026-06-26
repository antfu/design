<script setup lang="ts">
withDefaults(
  defineProps<{
    placeholder?: string
    /** Visible rows. */
    rows?: number
    disabled?: boolean
    /** Render the invalid (red) state. */
    invalid?: boolean
    /** Allow the user to resize the textarea. */
    resize?: boolean
  }>(),
  { rows: 4, resize: true },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <textarea
    v-model="model"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    :aria-invalid="invalid || undefined"
    class="color-base px-2 py-1.5 outline-none border rounded bg-base w-full transition placeholder:op-mute focus:ring-2"
    :class="[
      invalid ? 'border-red-500/60 focus:ring-red-500/40' : 'border-base focus:ring-primary-500/40',
      { 'resize-none': !resize, 'op50 pointer-events-none': disabled },
    ]"
  />
</template>
