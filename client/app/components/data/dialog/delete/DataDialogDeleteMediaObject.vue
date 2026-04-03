<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/media_objects/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <data-item-form-info-media-object
        :item
        :download-link="false"
        :read-link="false"
      />
    </template>
  </data-dialog-delete>
</template>
