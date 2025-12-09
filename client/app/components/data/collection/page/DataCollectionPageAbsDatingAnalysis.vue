<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/absolute_dating'
      | '/api/data/analyses/{parentId}/absolute_dating'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParent<'analysis'>
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
    <data-collection-table-abs-dating-analysis
      v-model:acl="acl"
      :path
      :parent
    />
  </data-collection-page>
</template>
