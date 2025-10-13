<script setup lang="ts">
withDefaults(
  defineProps<{
    iri: string
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)

const getCulturalContextVocabulary = useVocabularyStore(
  '/api/vocabulary/cultural_contexts',
)
</script>

<template>
  <data-item-info-box
    v-if="isValidIri(iri)"
    :iri
    path="/api/data/sites/{id}"
    :read-link
    data-testid="data-item-info-box-site"
  >
    <template #activator="props">
      <slot v-bind="{ props }" />
    </template>
    <template #default="{ item }">
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
    </template>
  </data-item-info-box>
</template>
