<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/analyses/potteries/{id}"
    title="Pottery Analysis"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-pottery-analysis :item />
    </template>
  </data-dialog-delete>
</template>
