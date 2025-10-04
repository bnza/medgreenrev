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

const vocabularyBotanyTaxonomy = useVocabularyStore(
  '/api/vocabulary/botany/taxonomies',
)
const vocabularyBotanyElement = useVocabularyStore(
  '/api/vocabulary/botany/elements',
)
const vocabularyBotanyElementParts = useVocabularyStore(
  '/api/vocabulary/botany/element_parts',
)
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
          :model-value="vocabularyBotanyTaxonomy.getValue(item.taxonomy)"
          label="taxonomy"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="
            vocabularyBotanyTaxonomy.getValue(item.taxonomy, 'class')
          "
          label="class"
        />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="
            vocabularyBotanyTaxonomy.getValue(item.taxonomy, 'family')
          "
          label="class"
        />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="
            vocabularyBotanyTaxonomy.getValue(item.taxonomy, 'vernacularName')
          "
          label="vernacular name"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="vocabularyBotanyElement.getValue(item.element)"
          label="element"
        />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="vocabularyBotanyElementParts.getValue(item.part)"
          label="part"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-textarea :model-value="item.notes" label="notes" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
