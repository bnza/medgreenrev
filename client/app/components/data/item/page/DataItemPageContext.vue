<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/contexts/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore(path))

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-context :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="sus">stratigraphic units</v-tab>
        <v-tab value="botanyAnalyses">botany analyses</v-tab>
        <v-tab value="zooAnalyses">zoo analyses</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="sus" data-testid="tab-sus">
          <data-collection-page-join-context-stratigraphic-unit
            path="/api/data/contexts/{parentId}/stratigraphic_units"
            :parent="{
              key: 'context',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item
          value="botanyAnalyses"
          data-testid="tab-botany-analyses"
        >
          <data-collection-page-analysis-context-botany
            path="/api/data/contexts/{parentId}/analyses/botany"
            :parent="{
              key: 'context',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="zooAnalyses" data-testid="tab-zoo-analyses">
          <data-collection-page-analysis-context-zoo
            path="/api/data/contexts/{parentId}/analyses/zoo"
            :parent="{
              key: 'context',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-context @refresh="redirectToCollectionPath()" />
      <data-dialog-update-context @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
