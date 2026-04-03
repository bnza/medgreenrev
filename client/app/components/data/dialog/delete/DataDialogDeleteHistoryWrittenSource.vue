<script lang="ts" setup>
defineEmits<{
  refresh: []
}>()
</script>
<template>
  <data-dialog-delete
    path="/api/data/history/written_sources/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-history-written-source
        :item
        :read-link="false"
      />
    </template>
  </data-dialog-delete>
</template>
