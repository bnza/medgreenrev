<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/sediment_core_depths'
      | '/api/data/sediment_cores/{parentId}/stratigraphic_units/depths'
      | '/api/data/stratigraphic_units/{parentId}/sediment_cores/depths'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParent<'sedimentCore'> | ResourceParent<'stratigraphicUnit'>
}>()

const { hasAnySitePrivilege, hasSitePrivilege, isAuthenticated } = useAppAuth()
</script>

<template>
  <data-collection-page
    :parent="Boolean(parent)"
    :path
    :show-back-button="false"
    :acl="{
      canExport: isAuthenticated,
      canCreate: parent?.item.site?.['@id']
        ? hasSitePrivilege(parent.item.site['@id'])
        : hasAnySitePrivilege,
    }"
  >
    <data-collection-table-sediment-core-depth :path :parent />
  </data-collection-page>
</template>
