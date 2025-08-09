<script lang="ts" setup>
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/context_samples/{id}"
    title="Context Sample"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-context-sample :item />
    </template>
  </data-dialog-delete>
</template>
