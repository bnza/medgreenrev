<script setup lang="ts">
import DataCollectionPageContextZooAnalysis from '~/components/data/collection/page/DataCollectionPageContextZooAnalysis.vue'

definePageMeta({
  public: true,
})
</script>

<template>
  <data-collection-page-context-zoo-analysis
    path="/api/data/analyses/contexts/zoo"
  />
</template>
