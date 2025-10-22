<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/botany/charcoals'
      | '/api/data/stratigraphic_units/{parentId}/botany/charcoals'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { ApiSpecialistRole } from '~/utils/consts/auth'
import DataCollectionTableBotanyCharcoal from '~/components/data/collection/table/DataCollectionTableBotanyCharcoal.vue'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'stratigraphicUnit'>
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
    return props.parent.item.site?.['@id']
      ? hasSitePrivilege.value(props.parent.item.site['@id'])
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
    <data-collection-table-botany-charcoal :path :parent />
  </data-collection-page>
</template>
