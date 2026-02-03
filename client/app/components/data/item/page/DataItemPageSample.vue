<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap, Iri } from '~~/types'

const path = '/api/data/samples/{id}' as const
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
      <lazy-data-item-form-info-sample :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="stratigraphic-units">stratigraphic units</v-tab>
        <v-tab value="microstratigraphic-units">microstratigraphic units</v-tab>
        <v-tab value="microAnalyses">microstratigraphical analyses</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item
          value="stratigraphic-units"
          data-testid="tab-window-sus"
        >
          <data-collection-page-join-sample-stratigraphic-unit
            path="/api/data/samples/{parentId}/stratigraphic_units"
            :parent="{
              key: 'sample',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item
          value="microstratigraphic-units"
          data-testid="tab-window-mus"
        >
          <data-collection-page-microstratigraphic-unit
            path="/api/data/samples/{parentId}/microstratigraphic_units"
            :parent="{
              key: 'sample',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item
          value="microAnalyses"
          data-testid="tab-window-micro-analyses"
        >
          <data-collection-page-analysis-sample-microstratigraphy
            path="/api/data/samples/{parentId}/analyses/microstratigraphy"
            :parent="{
              key: 'sample',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-sample @refresh="redirectToCollectionPath()" />
      <data-dialog-update-sample @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
