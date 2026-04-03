<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/analyses/botany/seeds/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-analysis-botany-seed :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
