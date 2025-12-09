<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/contexts/botany'
      | '/api/data/contexts/{parentId}/analyses/botany'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParent<'context'>
}>()

const { isAuthenticated } = useAppAuth()
const acl = ref({ canExport: isAuthenticated, canCreate: false })
</script>
<template>
  <data-collection-page
    :parent="Boolean(parent)"
    :path
    :show-back-button="!Boolean(parent)"
    :acl
  >
    <data-collection-table-analysis-context-botany
      v-model:acl="acl"
      :path
      :parent
    />
  </data-collection-page>
</template>
