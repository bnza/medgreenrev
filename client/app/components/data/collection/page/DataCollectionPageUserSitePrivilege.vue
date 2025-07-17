<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/site_user_privileges'
      | '/api/sites/{parentId}/site_user_privileges'
      | '/api/users/{parentId}/site_user_privileges'
    >
  "
>
import type {
  GetCollectionPath,
  ResourceParentSiteUserPrivilege,
} from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParentSiteUserPrivilege
}>()
</script>

<template>
  <data-collection-page
    :path
    title="Site/User Privilege"
    :show-back-button="!Boolean(parent)"
  >
    <data-collection-table-site-user-privilege :path :parent />
  </data-collection-page>
</template>
