<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

defineProps<{
  item: GetItemResponseMap['/api/data/sites/{id}'] | undefined
}>()

const getCulturalContextVocabulary = useVocabularyStore(
  '/api/vocabulary/cultural_contexts',
)
</script>

<template>
  <v-container v-if="item">
    <v-container v-if="item">
      <data-item-info-box-row label="name" :text="item.name" />
      <data-item-info-box-row label="description" :text="item.description" />
      <data-item-info-box-row
        label="cultural contexts"
        :text="
          getCulturalContextVocabulary.getValuesText(item.culturalContexts)
            .value
        "
      />
    </v-container>
  </v-container>
</template>
