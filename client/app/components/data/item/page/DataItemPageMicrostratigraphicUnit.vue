<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { Iri } from '~~/types'

const path = '/api/data/microstratigraphic_units/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))
defineProps<{
  iri?: Iri
}>()

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code" :iri>
    <template #default="{ item }">
      <data-item-form-info-microstratigraphic-unit :item />
      <v-tabs v-if="!iri" v-model="tab" background-color="transparent">
        <v-tab value="analyses">analyses</v-tab>
      </v-tabs>
      <v-tabs-window v-if="!iri" v-model="tab">
        <v-tabs-window-item value="analyses" data-testid="tab-analyses">
          <data-collection-page-analysis-sample-microstratigraphy
            path="/api/data/stratigraphic_units/{parentId}/analyses/samples/microstratigraphy"
            :parent="{ key: 'stratigraphicUnit', item: item.stratigraphicUnit }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-microstratigraphic-unit
        @refresh="redirectToCollectionPath()"
      />
      <data-dialog-update-microstratigraphic-unit @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
