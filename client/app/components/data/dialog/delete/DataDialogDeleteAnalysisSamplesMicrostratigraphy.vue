<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/analyses/samples/microstratigraphy/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-analysis-sample-microstratigraphy :item />
    </template>
  </data-dialog-delete>
</template>
