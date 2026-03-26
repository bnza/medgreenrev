<script setup lang="ts">
import type { Iri } from '~~/types'

definePageMeta({
  public: true,
})

const { id } = useRoute().params
</script>

<template>
  <data-collection-page-paleoclimate-sample
    path="/api/data/paleoclimate_sampling_sites/{parentId}/samples"
    filter-path="/api/data/paleoclimate_samples"
    :parent="{
      key: 'paleoclimateSamplingSite',
      item: {
        '@type': 'paleoclimateSamplingSites',
        '@id': `/api/data/paleoclimate_sampling_sites/${id}` as Iri,
      },
    }"
  />
</template>
