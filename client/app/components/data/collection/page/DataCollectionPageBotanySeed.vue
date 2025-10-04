<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/botany/seeds'
      | '/api/data/stratigraphic_units/{parentId}/botany/seeds'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { ApiSpecialistRole } from '~/utils/consts/auth'

const props = defineProps<{
  path: P
  parent?: ResourceParent<
    'stratigraphicUnit',
    '/api/data/stratigraphic_units/{id}'
  >
}>()

const {
  hasAnySitePrivilege,
  hasRoleAdmin,
  hasSitePrivilege,
  isAuthenticated,
  hasSpecialistRole,
} = useAppAuth()

const hasPrivileges = computed(() => {
  if (props.parent) {
    return props.parent.item.site?.id
      ? hasSitePrivilege.value(props.parent.item.site.id)
      : false
  }
  return hasAnySitePrivilege.value
})

const canCreate = computed(
  () =>
    hasRoleAdmin.value ||
    (hasPrivileges.value &&
      hasSpecialistRole(ApiSpecialistRole.Archaeobotanist).value),
)
</script>
<template>
  <data-collection-page
    :parent="Boolean(parent)"
    :path
    :show-back-button="!Boolean(parent)"
    :acl="{
      canExport: isAuthenticated,
      canCreate,
    }"
  >
    <data-collection-table-botany-seed :path :parent />
  </data-collection-page>
</template>
