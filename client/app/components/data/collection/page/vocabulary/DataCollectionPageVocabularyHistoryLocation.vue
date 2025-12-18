<script setup lang="ts">
import type { GetCollectionPath } from '~~/types'
import DataToolbarListItemCreate from '~/components/data/toolbar/DataToolbarListItemCreate.vue'

const path: GetCollectionPath = '/api/data/vocabulary/history/locations'

const { isAuthenticated } = useAppAuth()

const acl = ref({ canExport: isAuthenticated, canCreate: false })
</script>
<template>
  <data-collection-page :parent="false" :path :show-back-button="false" :acl>
    <template v-if="acl.canCreate" #collection-actions>
      <data-toolbar-list-item-create path="/api/vocabulary/history/locations" />
    </template>
    <data-collection-table-vocabulary-history-location />
  </data-collection-page>
</template>
