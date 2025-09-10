<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/zoo/bones/{id}']
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)

const vocabularyZooSpecies = useVocabularyStore('/api/vocabulary/zoo/species')
const vocabularyZooBones = useVocabularyStore('/api/vocabulary/zoo/bones')
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="item.stratigraphicUnit?.site?.name"
          label="site"
        >
          <template v-if="item.stratigraphicUnit?.site?.['@id']" #append-inner>
            <data-item-info-box-site
              :iri="item.stratigraphicUnit?.site?.['@id']"
              :read-link
            />
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.stratigraphicUnit?.code" label="SU">
          <template v-if="item.stratigraphicUnit?.['@id']" #append-inner>
            <data-item-info-box-stratigraphic-unit
              :iri="item.stratigraphicUnit?.['@id']"
              :read-link
            />
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="vocabularyZooSpecies.getValue(item.species, 'class')"
          label="class"
        />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="vocabularyZooSpecies.getValue(item.species, 'family')"
          label="class"
        />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="
            vocabularyZooSpecies.getValue(item.species, 'scientificName')
          "
          label="scientific name"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="vocabularyZooBones.getValue(item.element)"
          label="element"
        />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
