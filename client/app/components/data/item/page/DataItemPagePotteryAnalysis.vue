<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/analyses/potteries/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(
  useResourceUiStore('/api/data/analyses/potteries/{id}'),
)
</script>

<template>
  <data-item-page :path title="Pottery Analysis" identifier-prop="id">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-pottery-analysis :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-data">
          <p>Data</p>
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
