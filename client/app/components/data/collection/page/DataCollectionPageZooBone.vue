<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/zoo/bones'
      | '/api/data/stratigraphic_units/{parentId}/zoo/bones'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import DataCollectionTableZooBone from '~/components/data/collection/table/DataCollectionTableZooBone.vue'
import { ApiSpecialistRole } from '~/utils/consts/auth'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'stratigraphicUnit'>
}>()

const {
  hasAnySitePrivilege,
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
      canCreate,
    }"
  >
    <data-collection-table-zoo-bone :path :parent />
  </data-collection-page>
</template>
