<script setup lang="ts">
import type { Iri } from '~~/types'

definePageMeta({
  public: true,
})

const { id } = useRoute().params
</script>

<template>
  <data-collection-page-history-plant
    path="/api/data/history/locations/{parentId}/plants"
    filter-path="/api/data/history/plants"
    :parent="{
      key: 'vocHistoryLocation',
      item: {
        '@type': 'vocHistoryLocation',
        '@id': `/api/vocabulary/history/locations/${id}` as Iri,
      },
    }"
  />
</template>
