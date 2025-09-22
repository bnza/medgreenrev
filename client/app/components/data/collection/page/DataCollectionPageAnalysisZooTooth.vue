<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      '/api/data/analyses/zoo/teeth' | '/api/data/zoo/teeth/{parentId}/analyses'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { ApiSpecialistRole } from '~/utils/consts/auth'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'zooTooth', '/api/data/zoo/teeth/{id}'>
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
    return props.parent.item.stratigraphicUnit?.site?.['@id']
      ? hasSitePrivilege.value(
          Number(
            extractIdFromIri(props.parent.item.stratigraphicUnit.site['@id']),
          ),
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
    title="Animal tooth analyses"
    :parent="Boolean(parent)"
    :path
    :show-back-button="!Boolean(parent)"
    :acl="{
      canExport: isAuthenticated,
      canCreate: canCreate || hasRoleAdmin,
    }"
  >
    <data-collection-table-analysis-zoo-tooth :path :parent />
  </data-collection-page>
</template>
