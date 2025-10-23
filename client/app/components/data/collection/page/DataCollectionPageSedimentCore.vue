<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      '/api/data/sediment_cores' | '/api/data/sites/{parentId}/sediment_cores'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParent<'site'>
}>()

const { hasAnySitePrivilege, hasSitePrivilege, isAuthenticated } = useAppAuth()
</script>

<template>
  <data-collection-page
    :parent="Boolean(parent)"
    :path
    :show-back-button="false"
    :acl="{
      canExport: isAuthenticated,
      canCreate: parent?.item?.['@id']
        ? hasSitePrivilege(parent.item['@id'])
        : hasAnySitePrivilege,
    }"
  >
    <template #search-bar>
      <data-collection-search-text-field :path />
    </template>
    <data-collection-table-sediment-core :path :parent />
  </data-collection-page>
</template>
