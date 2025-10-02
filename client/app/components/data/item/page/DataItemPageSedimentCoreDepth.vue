<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap, Iri } from '~~/types'

const path = '/api/data/sediment_core_depths/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore(path))
defineProps<{
  iri?: Iri
}>()
</script>

<template>
  <data-item-page :path identifier-prop="code" :iri>
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-sediment-core-depth :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="samples">samples</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="samples" data-testid="tab-window-samples">
          <p>samples</p>
          <!--          <data-collection-page-sediment-core-depth-->
          <!--            path="/api/data/sediment_cores/{parentId}/depths"-->
          <!--            :parent="{-->
          <!--              key: 'sedimentCore',-->
          <!--              resourceItemPath: '/api/data/sediment_cores/{id}',-->
          <!--              item,-->
          <!--            }"-->
          <!--          />-->
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
