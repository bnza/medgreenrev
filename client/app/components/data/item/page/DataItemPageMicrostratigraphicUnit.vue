<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { Iri } from '~~/types'

const path = '/api/data/microstratigraphic_units/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))
defineProps<{
  iri?: Iri
}>()
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
          <!--          <data-collection-page-analysis-pottery-->
          <!--            path="/api/data/potteries/{parentId}/analyses"-->
          <!--            :parent="{-->
          <!--              key: 'pottery',-->
          <!--              resourceItemPath: '/api/data/potteries/{id}',-->
          <!--              item,-->
          <!--            }"-->
          <!--          />-->
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
