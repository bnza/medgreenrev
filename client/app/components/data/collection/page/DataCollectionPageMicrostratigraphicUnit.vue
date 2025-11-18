<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/microstratigraphic_units'
      | '/api/data/stratigraphic_units/{parentId}/microstratigraphic_units'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { ApiSpecialistRole } from '~/utils/consts/auth'

defineProps<{
  path: P
  parent?: ResourceParent<'stratigraphicUnit'>
}>()

const { hasSitePrivilege, isAuthenticated, hasSpecialistRole, hasRoleAdmin } =
  useAppAuth()
</script>
<template>
  <data-collection-page
    :parent="Boolean(parent)"
    :path
    :show-back-button="!Boolean(parent)"
    :acl="{
      canExport: isAuthenticated,
      canCreate: parent?.item.site?.['@id']
        ? hasSitePrivilege(parent.item.site['@id'])
        : hasRoleAdmin ||
          hasSpecialistRole(ApiSpecialistRole.GeoArchaeologist).value,
    }"
  >
    <data-collection-table-microstratigraphic-unit :path :parent />
  </data-collection-page>
</template>
