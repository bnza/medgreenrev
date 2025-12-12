<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap } from '~~/types'
import DataSelectionVocabulary from '~/components/data/selection/DataSelectionVocabulary.vue'

const { panels } = storeToRefs(useResourceUiStore('/api/data/sites/{id}'))
const props = defineProps<{
  item: GetItemResponseMap['/api/data/sites/{id}']
}>()
const culturalContexts = computed(
  () =>
    props.item.culturalContexts
      ?.filter((context) => Boolean(context['@id']))
      .map((context) => context['@id']) || [],
)
</script>

<template>
  <v-expansion-panels v-model="panels" multiple color="grey-darken-3" flat>
    <v-expansion-panel
      title="chronology"
      value="chronology"
      data-testid="chronology-panel"
    >
      <template #text>
        <v-container class="pa-0" fluid>
          <v-row>
            <v-col cols="6" xs="12" class="px-2">
              <v-text-field
                readonly
                :model-value="item.chronologyLower"
                label="chronology (lower)"
              />
            </v-col>
            <v-col cols="6" xs="12" class="px-2">
              <v-text-field
                readonly
                :model-value="item.chronologyUpper"
                label="chronology (upper)"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" xs="12" class="px-2">
              <data-selection-vocabulary
                readonly
                path="/api/vocabulary/cultural_contexts"
                :model-value="culturalContexts"
                label="cultural contexts"
                data-testid="cultural-contexts-selection"
              />
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
