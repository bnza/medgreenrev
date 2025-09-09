<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/media_objects/{id}"
    title="Media"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <data-item-form-info-media-object :item mode="update" />
    </template>
  </data-dialog-delete>
</template>
