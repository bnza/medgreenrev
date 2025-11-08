<script
  setup
  lang="ts"
  generic="
    P extends Extract<GetCollectionPath, '/api/data/analyses/absolute_dating'>
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: undefined
}>()

const { hasAnySpecialistRole, isAuthenticated, hasRoleAdmin } = useAppAuth()

const canCreate = computed(
  () => hasAnySpecialistRole.value,
  // && hasSpecialistRole(ApiSpecialistRole.CeramicSpecialist).value,
)
</script>
<template>
  <data-collection-page
    :parent="Boolean(parent)"
    :path
    :show-back-button="!Boolean(parent)"
    :acl="{
      canExport: isAuthenticated,
      canCreate: canCreate || hasRoleAdmin,
    }"
  >
    <data-collection-table-abs-dating-analysis :path :parent />
  </data-collection-page>
</template>
