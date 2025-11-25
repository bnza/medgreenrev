<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'
import { hasAcl } from '~/utils/acl'

const path = '/api/data/sites/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(
  useResourceUiStore('/api/data/sites/{id}', ['chronology']),
)
</script>

<template>
  <data-item-page :path identifier-prop="code">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-site :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="sus">stratigraphic units</v-tab>
        <v-tab value="contexts">contexts</v-tab>
        <v-tab value="samples">samples</v-tab>
        <v-tab value="anthroAnalyses">anthropological analyses</v-tab>
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
            path="/api/data/sites/{parentId}/stratigraphic_units"
            :parent="{
              key: 'site',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="contexts" data-testid="tab-window-contexts">
          <data-collection-page-context
            path="/api/data/sites/{parentId}/contexts"
            :parent="{
              key: 'site',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="samples" data-testid="tab-window-samples">
          <data-collection-page-sample
            path="/api/data/sites/{parentId}/samples"
            :parent="{
              key: 'site',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item
          value="anthroAnalyses"
          data-testid="tab-window-anthro-analyses"
        >
          <data-collection-page-analysis-site-anthropology
            path="/api/data/sites/{parentId}/analyses/anthropology"
            :parent="{
              key: 'site',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item
          v-if="hasAcl(item, 'canDelete') && item._acl.canDelete"
          value="privileges"
          data-testid="tab-window-privileges"
        >
          <data-collection-page-user-site-privilege
            v-if="item?.id"
            path="/api/admin/sites/{parentId}/site_user_privileges"
            :parent="{
              key: 'site',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
