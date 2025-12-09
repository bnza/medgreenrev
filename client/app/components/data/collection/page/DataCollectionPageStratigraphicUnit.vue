<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/stratigraphic_units'
      | '/api/data/sites/{parentId}/stratigraphic_units'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParent<'site'>
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
    <data-collection-table-stratigraphic-unit v-model:acl="acl" :path :parent />
  </data-collection-page>
</template>
