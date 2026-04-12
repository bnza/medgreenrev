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
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-window-data">
          <data-item-form-detail-sediment-core-depth :item="item" />
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
