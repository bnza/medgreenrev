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
    <data-collection-table-site-user-privilege
      v-model:acl="acl"
      :path
      :parent
    />
  </data-collection-page>
</template>
