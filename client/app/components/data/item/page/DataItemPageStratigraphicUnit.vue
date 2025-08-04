<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/stratigraphic_units/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore(path))
</script>

<template>
  <data-item-page :path title="Stratigraphic Unit" identifier-prop="code">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-stratigrafic-unit :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="contexts">contexts</v-tab>
        <!--        <v-tab-->
        <!--          v-if="hasAcl(item, 'canDelete') && item._acl.canDelete"-->
        <!--          value="privileges"-->
        <!--          >users privileges-->
        <!--        </v-tab>-->
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-data">
          <p>Data</p>
        </v-tabs-window-item>
        <v-tabs-window-item value="contexts" data-testid="tab-contexts">
          <data-collection-page-context-stratigraphic-unit
            path="/api/data/stratigraphic_units/{parentId}/contexts"
            :parent="{
              key: 'stratigraphicUnit',
              resourceItemPath: '/api/data/stratigraphic_units/{id}',
              item,
            }"
          />
        </v-tabs-window-item>
        <!--        <v-tabs-window-item-->
        <!--          v-if="hasAcl(item, 'canDelete') && item._acl.canDelete"-->
        <!--          value="privileges"-->
        <!--          data-testid="tab-privileges"-->
        <!--        >-->
        <!--          <data-collection-page-user-site-privilege-->
        <!--            v-if="item?.id"-->
        <!--            path="/api/admin/sites/{parentId}/site_user_privileges"-->
        <!--            :parent="{ key: 'site', resourceItemPath: '/api/data/sites/{id}', item }"-->
        <!--          />-->
        <!--        </v-tabs-window-item>-->
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
