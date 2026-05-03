<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>
<template>
  <data-dialog-delete
    path="/api/data/analyses/sediment_core_depth_botany_taxonomies/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-analysis-sediment-core-depth-botany-taxonomy
        :item
        :read-link="false"
      />
    </template>
  </data-dialog-delete>
</template>
