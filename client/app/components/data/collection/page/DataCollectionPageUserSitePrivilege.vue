<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/admin/site_user_privileges'
      | '/api/admin/sites/{parentId}/site_user_privileges'
      | '/api/admin/users/{parentId}/site_user_privileges'
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

const { siteCollectionAcl: acl } = useAppAuth()
</script>

<template>
  <data-collection-page
    :path
    title="Site/User Privileges"
    :show-back-button="!Boolean(parent)"
    :acl
  >
    <data-collection-table-site-user-privilege :path :parent />
  </data-collection-page>
</template>
