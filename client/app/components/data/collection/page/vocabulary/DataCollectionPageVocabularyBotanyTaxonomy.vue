<script setup lang="ts">
import type { GetCollectionPath } from '~~/types'

const path: GetCollectionPath = '/api/data/vocabulary/botany/taxonomies'

const acl = ref({ canExport: false, canCreate: false })
</script>
<template>
  <data-collection-page :parent="false" :path :show-back-button="false" :acl>
    <template v-if="acl.canCreate" #collection-create-action>
      <data-toolbar-list-item-create path="/api/vocabulary/botany/taxonomies" />
    </template>
    <data-collection-table-vocabulary-botany-taxonomy v-model:acl="acl" />
  </data-collection-page>
</template>
