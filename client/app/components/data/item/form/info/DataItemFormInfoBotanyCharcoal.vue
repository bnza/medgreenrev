<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/botany/charcoals/{id}']
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)

const vocabularyBotanyTaxonomy = useVocabularyStore(
  '/api/vocabulary/botany/taxonomies',
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
            <data-item-info-box-archaeological-site
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
      <v-col cols="2" xs="12" class="px-2">
        <v-checkbox :model-value="item.cf" label="CF" />
      </v-col>
      <v-col cols="2" xs="12" class="px-2">
        <v-checkbox :model-value="item.type" label="type" />
      </v-col>
      <v-col cols="6" xs="12" class="px-2">
        <v-text-field :model-value="item.flat?.value" label="taxonomy" />
      </v-col>
      <v-col cols="2" xs="12" class="px-2">
        <v-checkbox :model-value="item.sp" label="SP" />
      </v-col>
    </v-row>
    <!--    <v-row>-->
    <!--      <v-col cols="3" xs="12" class="px-2">-->
    <!--        <v-text-field :model-value="item.flat?.class" label="class" />-->
    <!--      </v-col>-->
    <!--      <v-col cols="3" xs="12" class="px-2">-->
    <!--        <v-text-field :model-value="item.flat?.family" label="family" />-->
    <!--      </v-col>-->
    <!--      <v-col cols="3" xs="12" class="px-2">-->
    <!--        <v-text-field :model-value="item.flat?.genus" label="genus" />-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <!--    <v-row>-->
    <!--      <v-col cols="6" xs="12" class="px-2">-->
    <!--        <v-text-field-->
    <!--          :model-value="-->
    <!--            vocabularyBotanyTaxonomy.getValue(item.taxonomy, 'englishName')-->
    <!--          "-->
    <!--          label="vernacular name"-->
    <!--        />-->
    <!--      </v-col>-->
    <!--      <v-col cols="6" xs="12" class="px-2">-->
    <!--        <v-text-field-->
    <!--          :model-value="-->
    <!--            vocabularyBotanyTaxonomy.getValue(item.taxonomy, 'spanishName')-->
    <!--          "-->
    <!--          label="spanish name"-->
    <!--        />-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <v-row>
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
