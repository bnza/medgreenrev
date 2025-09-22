<script setup lang="ts">
const model = defineModel<number | undefined>({
  required: true,
})

const items = [
  { title: 'requested', value: 0 },
  { title: 'pending', value: 1 },
  { title: 'completed', value: 2 },
]
</script>

<template>
  <v-select v-model="model" :items label="status" />
</template>
