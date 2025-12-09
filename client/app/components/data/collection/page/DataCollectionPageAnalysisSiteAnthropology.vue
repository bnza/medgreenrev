<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/sites/anthropology'
      | '/api/data/analyses/{parentId}/sites/anthropology'
      | '/api/data/sites/{parentId}/analyses/anthropology'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParent<'site'> | ResourceParent<'analysis'>
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
