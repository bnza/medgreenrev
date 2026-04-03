<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/botany/seeds'
      | '/api/data/stratigraphic_units/{parentId}/botany/seeds'
      | '/api/data/archaeological_sites/{parentId}/botany/seeds'
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
    <data-collection-table-botany-seed
      v-model:acl="acl"
      :path
      :parent
      :filter-path
    />
  </data-collection-page>
</template>
