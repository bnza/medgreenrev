<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'
import { hasAcl } from '~/utils/acl'

const path = '/api/sites/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore('/api/sites/{id}'))
</script>

<template>
  <data-item-page :path title="Site" identifier-prop="code">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-site :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="sus">stratigraphic units</v-tab>
        <v-tab
          v-if="hasAcl(item, 'canDelete') && item._acl.canDelete"
          value="privileges"
          >users privileges
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-window-data">
          <data-item-form-detail-site :item />
        </v-tabs-window-item>
        <v-tabs-window-item value="sus" data-testid="tab-window-sus">
          <data-collection-page-stratigraphic-unit
            path="/api/sites/{parentId}/stratigraphic_units"
            :parent="{ key: 'site', resourceItemPath: '/api/sites/{id}', item }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item
          v-if="hasAcl(item, 'canDelete') && item._acl.canDelete"
          value="privileges"
          data-testid="tab-window-privileges"
        >
          <data-collection-page-user-site-privilege
            v-if="item?.id"
            path="/api/sites/{parentId}/site_user_privileges"
            :parent="{ key: 'site', resourceItemPath: '/api/sites/{id}', item }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
