<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap } from '~~/types'

const { panels } = storeToRefs(
  useResourceUiStore('/api/data/paleoclimate_samples/{id}'),
)
defineProps<{
  item: GetItemResponseMap['/api/data/paleoclimate_samples/{id}']
}>()
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
            <v-col cols="6" class="px-2">
              <v-text-field
                readonly
                :model-value="item.chronologyLower"
                label="chronology (lower)"
              />
            </v-col>
            <v-col cols="6" class="px-2">
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
    <v-expansion-panel title="records" value="records" data-testid="records">
      <template #text>
        <v-container class="pa-0" fluid>
          <v-row>
            <v-col cols="6" class="px-2">
              <v-checkbox
                :model-value="item.precipitationRecord"
                label="precipitations"
              />
            </v-col>
            <v-col cols="6" class="px-2">
              <v-checkbox
                :model-value="item.temperatureRecord"
                label="temperature"
              />
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-expansion-panel>
    <v-expansion-panel title="proxies" value="proxies" data-testid="proxies">
      <template #text>
        <v-container class="pa-0" fluid>
          <v-row>
            <v-col cols="6" md="3" class="px-2">
              <v-checkbox
                :model-value="item.fluidInclusions"
                label="fluid inclusions"
              />
            </v-col>
            <v-col cols="6" md="3" class="px-2">
              <v-checkbox
                :model-value="item.petrographicDescriptions"
                label="petrographic descriptions"
              />
            </v-col>
            <v-col cols="6" md="3" class="px-2">
              <v-checkbox
                :model-value="item.stableIsotopes"
                label="stable isotopes"
              />
            </v-col>
            <v-col cols="6" md="3" class="px-2">
              <v-checkbox
                :model-value="item.traceElements"
                label="trace elements"
              />
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
