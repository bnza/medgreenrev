<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap } from '~~/types'

const { panels } = storeToRefs(
  useResourceUiStore('/api/data/sediment_core_depths/{id}'),
)
const props = defineProps<{
  item: GetItemResponseMap['/api/data/sediment_core_depths/{id}']
}>()
</script>

<template>
  <v-expansion-panels v-model="panels" multiple color="grey-darken-3" flat>
    <v-expansion-panel
      title="results"
      value="results"
      data-testid="results-panel"
    >
      <template #text>
        <v-container class="pa-0" fluid>
          <v-row>
            <v-col cols="3" class="px-2">
              <v-checkbox
                :model-value="item.geochemistry"
                label="geochemistry"
              />
            </v-col>
            <v-col cols="3" class="px-2">
              <v-checkbox
                  :model-value="item.microCharcoal"
                  label="microcharcoal"
              />
            </v-col>
            <v-col cols="3" class="px-2">
              <v-checkbox
                  :model-value="item.organicChemistry"
                  label="organic chemistry"
              />
            </v-col>
            <v-col cols="3" class="px-2">
              <v-checkbox
                  :model-value="item.oslDating"
                  label="OSL dating"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" class="px-2">
              <v-checkbox
                  :model-value="item.phytoliths"
                  label="phytoliths"
              />
            </v-col>
            <v-col cols="3" class="px-2">
              <v-checkbox
                  :model-value="item.phytoliths"
                  label="plant micro-remains"
              />
            </v-col>
            <v-col cols="3" class="px-2">
              <v-checkbox
                  :model-value="item.pollen"
                  label="pollen"
              />
            </v-col>
            <v-col cols="3" class="px-2">
              <v-checkbox
                  :model-value="item.sedimentaryDna"
                  label="sedimentaryDna"
              />
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
