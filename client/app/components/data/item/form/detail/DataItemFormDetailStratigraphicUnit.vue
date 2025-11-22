<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'

const { panels } = storeToRefs(
  useResourceUiStore('/api/data/stratigraphic_units/{id}'),
)
defineProps<{
  item: GetItemResponseMap['/api/data/stratigraphic_units/{id}']
}>()
</script>

<template>
  <v-expansion-panels v-model="panels" multiple color="grey-darken-3" flat>
    <v-expansion-panel
      title="description"
      value="description"
      data-testid="description"
    >
      <template #text>
        <v-container class="pa-0" fluid>
          <v-row>
            <v-col cols="12" xs="12" class="px-2">
              <v-textarea :model-value="item.description" label="description" />
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
        </v-container>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
