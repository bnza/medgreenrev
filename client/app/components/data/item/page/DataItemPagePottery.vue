<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'

const path = '/api/data/potteries/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))
</script>

<template>
  <data-item-page :path title="Pottery" identifier-prop="inventory">
    <template #default="{ item }">
      <lazy-data-item-form-info-pottery :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="analyses">analyses</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
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
