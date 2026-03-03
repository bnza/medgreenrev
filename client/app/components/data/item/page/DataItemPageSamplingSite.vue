<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap } from '~~/types'
import { hasAcl } from '~/utils/acl'

const path = '/api/data/sampling_sites/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(
  useResourceUiStore(path, ['location', 'chronology']),
)

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-sampling-site :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="sus">stratigraphic units</v-tab>
        <v-tab value="sedimentCores">sediment cores</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-window-data">
          <data-item-form-detail-sampling-site :item />
        </v-tabs-window-item>
        <v-tabs-window-item value="sus" data-testid="tab-window-sus">
          <data-collection-page-sampling-stratigraphic-unit
            path="/api/data/sampling_sites/{parentId}/stratigraphic_units"
            :parent="{
              key: 'samplingSite',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item
          value="sedimentCores"
          data-testid="tab-window-sediment-cores"
        >
          <data-collection-page-sediment-core
            path="/api/data/sampling_sites/{parentId}/sediment_cores"
            :parent="{
              key: 'samplingSite',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-sampling-site @refresh="redirectToCollectionPath()" />
      <data-dialog-update-sampling-site @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
