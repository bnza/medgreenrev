<script setup lang="ts">
import type { GetCollectionPath } from '~~/types'
import useCollectionQueryStore from '~/stores/collection-query'

const props = defineProps<{ path: GetCollectionPath }>()

const { pagination } = storeToRefs(useCollectionQueryStore(props.path))
</script>

<template>
  <div class="px-4">
    <v-text-field
      v-model="pagination.search"
      density="compact"
      placeholder="search"
      prepend-inner-icon="fas fa-magnifying-glass"
      variant="solo"
      width="200"
      flat
      hide-details
      single-line
      clearable
      data-testid="data-collection-search-text-field"
    />
  </div>
</template>
