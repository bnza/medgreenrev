<script setup lang="ts">
const options = [
  { title: 'female', value: 'F' },
  { title: 'male', value: 'M' },
  { title: 'indeterminate', value: '?' },
]

interface Props {
  errorMessages?: string | string[]
  label?: string
  multiple?: boolean
}

withDefaults(defineProps<Props>(), { label: 'sex' })

const model = defineModel<string[] | string | undefined | null>({
  required: true,
})
</script>

<template>
  <v-select
    v-model="model"
    :items="options"
    :label="label"
    :error-messages="errorMessages"
    :multiple
  />
</template>
