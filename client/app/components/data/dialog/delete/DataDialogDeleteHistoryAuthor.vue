<script lang="ts" setup>
defineEmits<{
  refresh: []
}>()
</script>
<template>
  <data-dialog-delete
    path="/api/vocabulary/history/authors/{id}"
    :fullscreen="false"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-history-author :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
