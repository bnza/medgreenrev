<script setup lang="ts">
const props = defineProps<{
  options: StyleCircleOptions
}>()

const size = computed(
  () => (props.options.radius + (props.options.stroke?.width || 0)) * 2,
)

const centerCoordinate = computed(
  () => props.options.radius + (props.options.stroke?.width || 0),
)

const fillColor = computed(() => props.options.fill.color.toString())
const strokeColor = computed(() => props.options.stroke.color.toString())
</script>

<template>
  <svg :width="size" :height="size" class="ml-2">
    <circle
      :cx="centerCoordinate"
      :cy="centerCoordinate"
      :r="props.options.radius"
      :fill="fillColor"
      :stroke="strokeColor"
      :stroke-width="props.options.stroke.width"
    />
  </svg>
</template>

<style scoped></style>
