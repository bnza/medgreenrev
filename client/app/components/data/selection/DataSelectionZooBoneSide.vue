<script setup lang="ts">
// Options for side field
const sideOptions = [
  { title: 'left', value: 'L' },
  { title: 'right', value: 'R' },
  { title: 'indeterminate', value: '?' },
]

interface Props {
  errorMessages?: string | string[]
  label?: string
  multiple?: boolean
}

defineProps<Props>()

const model = defineModel<string[] | string | undefined | null>({
  required: true,
})
</script>

<template>
  <v-select
    v-model="model"
    :items="sideOptions"
    :label="label || 'side'"
    :error-messages="errorMessages"
    :multiple
  />
</template>
