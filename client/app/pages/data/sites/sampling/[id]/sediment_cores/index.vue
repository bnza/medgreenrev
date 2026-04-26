<script setup lang="ts">
import type { Iri } from '~~/types'
definePageMeta({
  public: true,
})
const { id } = useRoute().params
</script>
<template>
  <data-collection-page-sediment-core
    path="/api/data/sampling_sites/{parentId}/sediment_cores"
    :parent="{
      key: 'samplingSite',
      item: {
        '@type': 'samplingSite',
        '@id': `/api/data/sampling_sites/${id}` as Iri,
      },
    }"
  />
</template>
