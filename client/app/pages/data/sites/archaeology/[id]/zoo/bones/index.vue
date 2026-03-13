<script setup lang="ts">
import type { Iri } from '~~/types'

definePageMeta({
  public: true,
})

const { id } = useRoute().params
</script>

<template>
  <data-collection-page-zoo-bone
    path="/api/data/archaeological_sites/{parentId}/zoo/bones"
    filter-path="/api/data/zoo/bones"
    :parent="{
      key: 'archaeologicalSite',
      item: {
        '@type': 'archaeologicalSite',
        '@id': `/api/data/archaeological_sites/${id}` as Iri,
      },
    }"
  />
</template>
