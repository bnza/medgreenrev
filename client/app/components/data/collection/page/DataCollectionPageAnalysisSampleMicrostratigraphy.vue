<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/samples/microstratigraphy'
      | '/api/data/analyses/{parentId}/samples/microstratigraphy'
      | '/api/data/samples/{parentId}/analyses/microstratigraphy'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParent<'sample'> | ResourceParent<'analysis'>
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
    <data-collection-table-analysis-sample-microstratigraphy
      v-model:acl="acl"
      :path
      :parent
    />
  </data-collection-page>
</template>
