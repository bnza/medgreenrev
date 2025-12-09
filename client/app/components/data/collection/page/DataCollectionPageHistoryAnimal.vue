<script
  setup
  lang="ts"
  generic="P extends Extract<GetCollectionPath, '/api/data/history/animals'>"
>
import type { GetCollectionPath } from '~~/types'

defineProps<{
  path: P
}>()

const { isAuthenticated } = useAppAuth()
const acl = ref({ canExport: isAuthenticated, canCreate: false })
</script>
<template>
  <data-collection-page :parent="false" :path show-back-button :acl>
    <data-collection-table-history-animal v-model:acl="acl" :path />
  </data-collection-page>
</template>
