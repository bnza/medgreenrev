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

const vocabularyZooSpecies = useVocabularyStore('/api/vocabulary/zoo/species')
const vocabularyZooBones = useVocabularyStore('/api/vocabulary/zoo/bones')
const vocabularyZooBoneParts = useVocabularyStore(
  '/api/vocabulary/zoo/bone_parts',
)
</script>

<template>
  <data-item-info-box
    v-if="isValidIri(iri)"
    :iri
    path="/api/data/zoo/bones/{id}"
    title="Animal bone"
    data-testid="data-item-info-box-zoo-bones"
    :app-path="readLink ? '/data/zoo/bones' : undefined"
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
          label="species"
          :text="vocabularyZooSpecies.getValue(item.species).value"
        />
        <data-item-info-box-row
          label="element"
          :text="vocabularyZooBones.getValue(item.element).value"
        />
        <data-item-info-box-row
          label="part"
          :text="vocabularyZooBoneParts.getValue(item.part).value"
        />
        <data-item-info-box-row label="notes" :text="item.notes" />
      </v-container>
    </template>
  </data-item-info-box>
</template>
