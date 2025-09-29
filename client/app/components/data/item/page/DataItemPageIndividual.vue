<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/individuals/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore(path))
</script>

<template>
  <data-item-page :path identifier-prop="identifier">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-individual :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="analyses">analyses</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="analyses" data-testid="tab-analyses">
          <p>analyses</p>
          <!--          <data-collection-page-context-zoo-analysis-->
          <!--            path="/api/data/contexts/{parentId}/analyses/zoo"-->
          <!--            :parent="{-->
          <!--              key: 'context',-->
          <!--              resourceItemPath: '/api/data/contexts/{id}',-->
          <!--              item,-->
          <!--            }"-->
          <!--          />-->
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
