<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap } from '~~/types'

const { panels } = storeToRefs(
  useResourceUiStore('/api/data/sampling_sites/{id}'),
)
const props = defineProps<{
  item: GetItemResponseMap['/api/data/sampling_sites/{id}']
}>()
</script>

<template>
  <v-expansion-panels v-model="panels" multiple color="grey-darken-3" flat>
    <v-expansion-panel
      title="location"
      value="location"
      data-testid="location-panel"
    >
      <template #text>
        <v-container class="pa-0" fluid>
          <data-item-form-coordinate :x="item.e" :y="item.n" />
        </v-container>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
