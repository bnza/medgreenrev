<script lang="ts" setup>
defineEmits<{
  refresh: []
}>()
</script>
<template>
  <data-dialog-delete
    path="/api/data/history/animals/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-history-animal :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
