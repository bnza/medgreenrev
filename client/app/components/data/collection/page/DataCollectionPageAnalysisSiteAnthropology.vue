<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/archaeological_sites/anthropology'
      | '/api/data/analyses/{parentId}/archaeological_sites/anthropology'
      | '/api/data/archaeological_sites/{parentId}/analyses/anthropology'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParent<'archaeologicalSite'> | ResourceParent<'analysis'>
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
    <data-collection-table-analysis-site-anthropology
      v-model:acl="acl"
      :path
      :parent
    />
  </data-collection-page>
</template>
