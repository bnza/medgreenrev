<script
  setup
  lang="ts"
  generic="P extends Extract<GetCollectionPath, '/api/data/history/locations'>"
>
import type { GetCollectionPath } from '~~/types'
import { ApiSpecialistRole } from '~/utils/consts/auth'

defineProps<{
  path: P
}>()

const { hasSpecialistRole, isAuthenticated, hasRoleAdmin } = useAppAuth()

const canCreate = computed(
  () =>
    hasRoleAdmin.value && hasSpecialistRole(ApiSpecialistRole.Historian).value,
)
</script>
<template>
  <data-collection-page
    :parent="false"
    :path
    show-back-button
    :acl="{
      canExport: isAuthenticated,
      canCreate: canCreate || hasRoleAdmin,
    }"
  >
    <data-collection-table-history-location :path />
  </data-collection-page>
</template>
