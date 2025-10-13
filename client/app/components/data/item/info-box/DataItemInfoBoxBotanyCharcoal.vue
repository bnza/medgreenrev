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

const vocabularyBotanyTaxonomy = useVocabularyStore(
  '/api/vocabulary/botany/taxonomies',
)
const vocabularyBotanyElement = useVocabularyStore(
  '/api/vocabulary/botany/elements',
)
const vocabularyBotanyElementPart = useVocabularyStore(
  '/api/vocabulary/botany/element_parts',
)
</script>

<template>
  <data-item-info-box
    v-if="isValidIri(iri)"
    :iri
    path="/api/data/botany/charcoals/{id}"
    :read-link
    data-testid="data-item-info-box-botany-charcoals"
  >
    <template #activator="props">
      <slot v-bind="{ props }" />
    </template>
    <template #default="{ item }">
      <v-container v-if="item">
        <data-item-info-box-row
          label="site"
          :text="item.stratigraphicUnit?.site?.name"
        />
        <data-item-info-box-row
          label="SU"
          :text="item.stratigraphicUnit?.code"
        />
        <data-item-info-box-row
          label="taxonomy"
          :text="vocabularyBotanyTaxonomy.getValue(item.taxonomy).value"
        />
        <data-item-info-box-row
          label="element"
          :text="vocabularyBotanyElement.getValue(item.element).value"
        />
        <data-item-info-box-row
          label="part"
          :text="vocabularyBotanyElementPart.getValue(item.part).value"
        />
        <data-item-info-box-row label="notes" :text="item.notes" />
      </v-container>
    </template>
  </data-item-info-box>
</template>
