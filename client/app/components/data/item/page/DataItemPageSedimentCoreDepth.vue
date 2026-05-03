<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap, Iri } from '~~/types'

const path = '/api/data/sediment_core_depths/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore(path))
defineProps<{
  iri?: Iri
}>()

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code" :iri>
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-sediment-core-depth :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="assemblage_analyses">assemblage analyses</v-tab>
        <v-tab value="specimen_analyses">specimen analyses</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-window-data">
          <data-item-form-detail-sediment-core-depth :item="item" />
        </v-tabs-window-item>
        <v-tabs-window-item
          value="specimen_analyses"
          data-testid="tab-window-specimen-analyses"
        >
          <data-collection-page-analysis-sediment-core-depth
            path="/api/data/sediment_core_depths/{parentId}/analyses"
            :parent="{
              key: 'sedimentCoreDepth',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item
          value="assemblage_analyses"
          data-testid="tab-window-assemblage-analyses"
        >
          <data-collection-page-analysis-sediment-core-depth-botany
            path="/api/data/sediment_core_depths/{parentId}/analyses/botany"
            :parent="{
              key: 'sedimentCoreDepth',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-sediment-core-depth
        @refresh="redirectToCollectionPath()"
      />
      <data-dialog-update-sediment-core-depth @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
