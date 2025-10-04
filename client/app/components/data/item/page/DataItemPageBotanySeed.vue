<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { Iri } from '~~/types'

const path = '/api/data/botany/seeds/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))
defineProps<{
  iri?: Iri
}>()
</script>

<template>
  <data-item-page :path identifier-prop="inventory" :iri>
    <template #default="{ item }">
      <lazy-data-item-form-info-botany-seed :item />
      <v-tabs v-if="!iri" v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="analyses">analyses</v-tab>
      </v-tabs>
      <v-tabs-window v-if="!iri" v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-data">
          <p>Data</p>
        </v-tabs-window-item>
        <v-tabs-window-item value="analyses" data-testid="tab-analyses">
          <p>Analyses</p>
          <!--          <data-collection-page-analysis-zoo-bone-->
          <!--            path="/api/data/botany/seeds/{parentId}/analyses"-->
          <!--            :parent="{-->
          <!--              key: 'zooBone',-->
          <!--              resourceItemPath: '/api/data/botany/seeds/{id}',-->
          <!--              item,-->
          <!--            }"-->
          <!--          />-->
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
