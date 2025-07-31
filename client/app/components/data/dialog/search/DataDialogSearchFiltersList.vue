<script setup lang="ts">
import type { FilterState } from '~~/types'

defineProps<{
  filters: FilterState
}>()
defineEmits<{
  delete: [id: string]
  update: [id: string]
}>()
</script>

<template>
  <v-list v-if="Object.keys(filters).length > 0">
    <data-dialog-search-filters-list-item
      v-for="(filter, key) in filters"
      :key
      :filter
      @delete="$emit('delete', String(key))"
      @update="$emit('update', String(key))"
    />
  </v-list>
</template>
