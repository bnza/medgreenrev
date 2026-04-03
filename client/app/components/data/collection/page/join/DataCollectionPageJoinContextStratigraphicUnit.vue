<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/context_stratigraphic_units'
      | '/api/data/stratigraphic_units/{parentId}/contexts'
      | '/api/data/contexts/{parentId}/stratigraphic_units'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'stratigraphicUnit'> | ResourceParent<'context'>
}>()
const { item: parentItem } = useResourceParent(props.parent)

const { hasAnySitePrivilege, hasSitePrivilege, isAuthenticated } = useAppAuth()
const siteId = computed(() => {
  const id = parentItem.value?.site?.['@id']
  return id ? Number(extractIdFromIri(id)) : undefined
})
</script>

<template>
  <data-collection-page
    :parent="Boolean(parent)"
    :path
    :show-back-button="!Boolean(parent)"
    :acl="{
      canExport: isAuthenticated,
      canCreate: siteId ? hasSitePrivilege(siteId) : hasAnySitePrivilege,
    }"
  >
    <data-collection-table-join-context-stratigraphic-unit :path :parent />
  </data-collection-page>
</template>
