<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/potteries'
      | '/api/data/stratigraphic_units/{parentId}/potteries'
      | '/api/data/archaeological_sites/{parentId}/potteries'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?:
    | ResourceParent<'stratigraphicUnit'>
    | ResourceParent<'archaeologicalSite'>
  filterPath?: GetCollectionPath
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
    :filter-path
  >
    <template #search-bar>
      <data-collection-search-text-field :path />
    </template>
    <data-collection-table-pottery
      v-model:acl="acl"
      :path
      :parent
      :filter-path
    />
  </data-collection-page>
</template>
