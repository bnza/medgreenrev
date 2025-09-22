<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/contexts/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore(path))
</script>

<template>
  <data-item-page :path title="Context" identifier-prop="code">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-context :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <!--        <v-tab value="samples">samples</v-tab>-->
        <v-tab value="sus">stratigraphic-units</v-tab>
        <v-tab value="zooAnalyses">zoo analyses</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-data">
          <p>Data</p>
        </v-tabs-window-item>
        <!--        <v-tabs-window-item value="samples" data-testid="tab-window-samples">-->
        <!--          <data-collection-page-join-context-sample-->
        <!--            path="/api/data/contexts/{parentId}/samples"-->
        <!--            :parent="{-->
        <!--              key: 'context',-->
        <!--              resourceItemPath: '/api/data/contexts/{id}',-->
        <!--              item,-->
        <!--            }"-->
        <!--          />-->
        <!--        </v-tabs-window-item>-->
        <v-tabs-window-item value="sus" data-testid="tab-sus">
          <data-collection-page-join-context-stratigraphic-unit
            path="/api/data/contexts/{parentId}/stratigraphic_units"
            :parent="{
              key: 'context',
              resourceItemPath: '/api/data/contexts/{id}',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="zooAnalyses" data-testid="tab-zoo-analyses">
          <data-collection-page-context-zoo-analysis
            path="/api/data/contexts/{parentId}/analyses/zoo"
            :parent="{
              key: 'context',
              resourceItemPath: '/api/data/contexts/{id}',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
