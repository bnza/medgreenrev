<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      '/api/data/samples' | '/api/data/sites/{parentId}/samples'
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
    :show-back-button="false"
    :acl
  >
    <template #search-bar>
      <data-collection-search-text-field :path />
    </template>
    <data-collection-table-sample v-model:acl="acl" :path :parent />
  </data-collection-page>
</template>
