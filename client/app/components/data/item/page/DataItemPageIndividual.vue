<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/individuals/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore(path))

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-individual :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="analyses">analyses</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="analyses" data-testid="tab-analyses">
          <data-collection-page-analysis-individual
            path="/api/data/individuals/{parentId}/analyses"
            :parent="{
              key: 'individual',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-individual @refresh="redirectToCollectionPath()" />
      <data-dialog-update-individual @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
