<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/contexts/zoo'
      | '/api/data/contexts/{parentId}/analyses/zoo'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { ApiSpecialistRole } from '~/utils/consts/auth'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'context'>
}>()

const {
  hasAnySitePrivilege,
  hasSitePrivilege,
  isAuthenticated,
  hasSpecialistRole,
  hasRoleAdmin,
} = useAppAuth()

const hasPrivileges = computed(() => {
  if (props.parent) {
    return props.parent.item.site?.['@id']
      ? hasSitePrivilege.value(
          Number(extractIdFromIri(props.parent.item.site['@id'])),
        )
      : false
  }
  return hasAnySitePrivilege.value
})

const canCreate = computed(
  () =>
    hasPrivileges.value &&
    hasSpecialistRole(ApiSpecialistRole.ZooArchaeologist).value,
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
    <data-collection-table-analysis-context-zoo :path :parent />
  </data-collection-page>
</template>
