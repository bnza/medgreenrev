<script setup lang="ts">
definePageMeta({
  public: true,
})
const path = '/api/data/analyses/sediment_core_depths/botany' as const
</script>
<template>
  <data-collection-page-analysis-sediment-core-depth-botany :path />
</template>
