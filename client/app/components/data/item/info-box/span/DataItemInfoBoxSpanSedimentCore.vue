<script setup lang="ts">
const props = defineProps<{
  iri: string
  text: string
}>()
</script>

<template>
  <data-item-info-box-sediment-core
    v-slot="{ props: slotProps }"
    :iri="props.iri"
  >
    <span class="text-secondary font-weight-bold" v-bind="slotProps">
      {{ props.text }}
    </span>
  </data-item-info-box-sediment-core>
</template>
