<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/sediment_cores_depths'
      | '/api/data/sediment_cores/{parentId}/depths'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParent<'sedimentCore', '/api/data/sediment_cores/{id}'>
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
      canCreate: parent?.item.id
        ? hasSitePrivilege(parent.item.id)
        : hasAnySitePrivilege,
    }"
  >
    <data-collection-table-sediment-core-depth :path :parent />
  </data-collection-page>
</template>
