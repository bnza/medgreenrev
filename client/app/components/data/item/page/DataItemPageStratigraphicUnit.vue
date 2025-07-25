<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/stratigraphic_units/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore(path))
const { isSiteAdmin } = useAppAuth()
</script>

<template>
  <data-item-page :path title="Stratigraphic Unit" identifier-prop="code">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-stratigrafic-unit :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <!--        <v-tab-->
        <!--          v-if="hasAcl(item, 'canDelete') && item._acl.canDelete"-->
        <!--          value="privileges"-->
        <!--          >users privileges-->
        <!--        </v-tab>-->
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-privileges">
          <p>Data</p>
        </v-tabs-window-item>
        <!--        <v-tabs-window-item-->
        <!--          v-if="hasAcl(item, 'canDelete') && item._acl.canDelete"-->
        <!--          value="privileges"-->
        <!--          data-testid="tab-privileges"-->
        <!--        >-->
        <!--          <data-collection-page-user-site-privilege-->
        <!--            v-if="item?.id"-->
        <!--            path="/api/sites/{parentId}/site_user_privileges"-->
        <!--            :parent="{ key: 'site', resourceItemPath: '/api/sites/{id}', item }"-->
        <!--          />-->
        <!--        </v-tabs-window-item>-->
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
