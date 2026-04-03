<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { Iri } from '~~/types'

const path = '/api/data/zoo/teeth/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))
defineProps<{
  iri?: Iri
}>()

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code" :iri>
    <template #default="{ item }">
      <lazy-data-item-form-info-zoo-tooth :item />
      <v-tabs v-if="!iri" v-model="tab" background-color="transparent">
        <v-tab value="analyses">analyses</v-tab>
      </v-tabs>
      <v-tabs-window v-if="!iri" v-model="tab">
        <v-tabs-window-item value="analyses" data-testid="tab-analyses">
          <data-collection-page-analysis-zoo-tooth
            path="/api/data/zoo/teeth/{parentId}/analyses"
            :parent="{
              key: 'zooTooth',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-zoo-tooth @refresh="redirectToCollectionPath()" />
      <data-dialog-update-zoo-tooth @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
