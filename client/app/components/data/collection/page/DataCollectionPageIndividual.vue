<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/individuals'
      | '/api/data/stratigraphic_units/{parentId}/individuals'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParent<'stratigraphicUnit'>
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
    <template #search-bar>
      <data-collection-search-text-field :path />
    </template>
    <data-collection-table-individual v-model:acl="acl" :path :parent />
  </data-collection-page>
</template>
