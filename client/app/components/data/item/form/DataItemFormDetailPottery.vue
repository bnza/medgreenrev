<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'

const { panels } = storeToRefs(useResourceUiStore('/api/data/potteries/{id}'))
const props = defineProps<{
  item: GetItemResponseMap['/api/data/potteries/{id}']
}>()
</script>

<template>
  <v-expansion-panels v-model="panels" multiple color="grey-darken-3" flat>
    <v-expansion-panel title="aspect" value="aspect" data-testid="aspect-panel">
      <template #text>
        <v-container class="pa-0" fluid>
          <v-row>
            <v-col cols="4" xs="12" class="px-2">
              <data-selection-vocabulary
                :model-value="item.surfaceTreatment ?? undefined"
                path="/api/vocabulary/pottery/surface_treatments"
                label="surface treatment"
              />
            </v-col>
            <v-col cols="4" xs="12" class="px-2">
              <v-text-field
                :model-value="item.innerColor"
                label="inner color"
              />
            </v-col>
            <v-col cols="4" xs="12" class="px-2">
              <v-text-field
                :model-value="item.outerColor"
                label="outer color"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" xs="12" class="px-2">
              <data-selection-vocabulary
                readonly
                path="/api/vocabulary/pottery/decorations"
                item-title="value"
                :model-value="
                  (item.decorations ?? [])
                    .map((decoration) => decoration['@id'])
                    .filter((id): id is string => Boolean(id))
                "
                label="decorations"
                data-testid="decorations-selection"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8" xs="12" class="px-2">
              <v-text-field
                :model-value="item.decorationMotif"
                label="decoration motif"
              />
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-expansion-panel>
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
              <data-autocomplete
                readonly
                path="/api/vocabulary/cultural_contexts"
                item-title="value"
                :model-value="item.culturalContext ?? undefined"
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
