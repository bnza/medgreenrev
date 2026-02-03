<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { Iri } from '~~/types'

const path = '/api/data/zoo/bones/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))
defineProps<{
  iri?: Iri
}>()

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="inventory" :iri>
    <template #default="{ item }">
      <lazy-data-item-form-info-zoo-bone :item />
      <v-tabs v-if="!iri" v-model="tab" background-color="transparent">
        <v-tab value="analyses">analyses</v-tab>
      </v-tabs>
      <v-tabs-window v-if="!iri" v-model="tab">
        <v-tabs-window-item value="analyses" data-testid="tab-analyses">
          <data-collection-page-analysis-zoo-bone
            path="/api/data/zoo/bones/{parentId}/analyses"
            :parent="{
              key: 'zooBone',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-zoo-bone @refresh="redirectToCollectionPath()" />
      <data-dialog-update-zoo-bone @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
