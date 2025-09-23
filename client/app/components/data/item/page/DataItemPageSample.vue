<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/samples/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore(path))
</script>

<template>
  <data-item-page :path identifier-prop="id">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-sample :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <!--        <v-tab value="contexts">contexts</v-tab>-->
        <v-tab value="stratigraphic-units">stratigraphic units</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-data">
          <p>Data</p>
        </v-tabs-window-item>
        <v-tabs-window-item
          value="stratigraphic-units"
          data-testid="tab-window-sus"
        >
          <data-collection-page-join-sample-stratigraphic-unit
            path="/api/data/samples/{parentId}/stratigraphic_units"
            :parent="{
              key: 'sample',
              resourceItemPath: '/api/data/samples/{id}',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
