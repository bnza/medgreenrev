<script setup lang="ts">
definePageMeta({
  public: true,
})
const path = '/api/data/analyses/samples/botany' as const
</script>
<template>
  <data-collection-page-analysis-sample-botany :path />
</template>
