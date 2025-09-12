<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/zoo/teeth/{id}"
    title="Zooarchaeological (tooth)"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-zoo-tooth :item />
    </template>
  </data-dialog-delete>
</template>
