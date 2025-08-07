<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      '/api/data/contexts' | '/api/data/sites/{parentId}/contexts'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParent<'site', '/api/data/sites/{id}'>
}>()

const { hasAnySitePrivilege, hasSitePrivilege, isAuthenticated } = useAppAuth()
</script>

<template>
  <data-collection-page
    :path
    title="Contexts"
    :show-back-button="!Boolean(parent)"
    :acl="{
      canExport: isAuthenticated,
      canCreate: parent?.item.id
        ? hasSitePrivilege(parent.item.id)
        : hasAnySitePrivilege,
    }"
  >
    <data-collection-table-context :path :parent />
  </data-collection-page>
</template>
