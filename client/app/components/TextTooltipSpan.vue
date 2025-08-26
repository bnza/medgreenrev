<script setup lang="ts">
const props = defineProps<{
  text: string | undefined
}>()
const shortText = computed(() => props.text?.substring(0, 300) || '')
defineSlots<{
  default: (props: { text: string }) => any
}>()
</script>

<template>
  <span v-if="text">
    {{ shortText }}<span v-if="text.length > 300" class="text-gray">...</span>
    <v-tooltip v-if="text.length > 300" activator="parent">{{
      text
    }}</v-tooltip>
  </span>
</template>

<style scoped></style>
