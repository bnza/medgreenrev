<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/samples/microstratigraphy'
      | '/api/data/analyses/{parentId}/samples/microstratigraphy'
      | '/api/data/samples/{parentId}/analyses/microstratigraphy'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { ApiSpecialistRole } from '~/utils/consts/auth'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'sample'> | ResourceParent<'analysis'>
}>()

const {
  hasAnySitePrivilege,
  hasSitePrivilege,
  isAuthenticated,
  hasSpecialistRole,
  hasRoleAdmin,
} = useAppAuth()

const hasPrivileges = computed(() => {
  if (props.parent && props.parent.key === 'sample') {
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
    hasSpecialistRole(ApiSpecialistRole.GeoArchaeologist).value,
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
    <data-collection-table-analysis-sample-microstratigraphy :path :parent />
  </data-collection-page>
</template>
