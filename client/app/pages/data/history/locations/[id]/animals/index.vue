<script setup lang="ts">
import type { Iri } from '~~/types'

definePageMeta({
  public: true,
})

const { id } = useRoute().params
</script>

<template>
  <data-collection-page-history-animal
    path="/api/data/history/locations/{parentId}/animals"
    filter-path="/api/data/history/animals"
    :parent="{
      key: 'vocHistoryLocation',
      item: {
        '@type': 'vocHistoryLocation',
        '@id': `/api/vocabulary/history/locations/${id}` as Iri,
      },
    }"
  />
</template>
