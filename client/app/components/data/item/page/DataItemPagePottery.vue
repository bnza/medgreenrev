<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { Iri } from '~~/types'

const path = '/api/data/potteries/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))
defineProps<{
  iri?: Iri
}>()
</script>

<template>
  <data-item-page :path identifier-prop="inventory" :iri>
    <template #default="{ item }">
      <lazy-data-item-form-info-pottery :item />
      <v-tabs v-if="!iri" v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="analyses">analyses</v-tab>
      </v-tabs>
      <v-tabs-window v-if="!iri" v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-data">
          <data-item-form-detail-pottery :item />
        </v-tabs-window-item>
        <v-tabs-window-item value="analyses" data-testid="tab-analyses">
          <data-collection-page-pottery-analysis
            path="/api/data/potteries/{parentId}/analyses"
            :parent="{
              key: 'pottery',
              resourceItemPath: '/api/data/potteries/{id}',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
