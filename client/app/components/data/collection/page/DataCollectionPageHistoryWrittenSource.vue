<script
  setup
  lang="ts"
  generic="
    P extends Extract<GetCollectionPath, '/api/data/history/written_sources'>
  "
>
import type { GetCollectionPath } from '~~/types'

defineProps<{
  path: P
}>()

const { isAuthenticated } = useAppAuth()
const acl = ref({ canExport: isAuthenticated, canCreate: false })
</script>

<template>
  <data-collection-page :path :acl :parent="false">
    <template #search-bar>
      <data-collection-search-text-field :path />
    </template>
    <data-collection-table-history-written-source v-model:acl="acl" :path />
  </data-collection-page>
</template>
