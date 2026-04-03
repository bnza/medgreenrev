<script setup lang="ts">
// Options for ends preserved field (bitmap)
const endsPreservedOptions = [
  { title: 'Distal (D)', value: 1 },
  { title: 'Proximal (P)', value: 2 },
  { title: 'Both (D + P)', value: 3 },
]

interface Props {
  errorMessages?: string | string[]
  label?: string
}

defineProps<Props>()

const model = defineModel<number | undefined | null>({ required: true })
</script>

<template>
  <v-select
    v-model="model"
    :items="endsPreservedOptions"
    :label="label || 'ends preserved'"
    :error-messages="errorMessages"
    flat
  />
</template>
