<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/analyses/contexts/zoo/{id}"
    title="Zooarcheological context analysis"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-context-zoo-analysis :item />
    </template>
  </data-dialog-delete>
</template>
