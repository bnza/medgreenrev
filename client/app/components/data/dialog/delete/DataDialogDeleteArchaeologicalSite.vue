<script lang="ts" setup>
defineEmits<{
  refresh: []
}>()
</script>
<template>
  <data-dialog-delete
    path="/api/data/archaeological_sites/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-archaeological-site :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
