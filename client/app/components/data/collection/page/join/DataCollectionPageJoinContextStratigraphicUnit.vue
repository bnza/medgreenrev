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
import type { GetCollectionPath, Iri, ResourceParent } from '~~/types'

const props = defineProps<{
  path: P
  parent?:
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
    | ResourceParent<'context', '/api/data/contexts/{id}'>
}>()
const { item: parentItem } = useResourceParent(props.parent)

const title = computed(() =>
  props.parent?.key === 'stratigraphicUnit'
    ? 'contexts'
    : 'stratigraphic units',
)
const { hasAnySitePrivilege, hasSitePrivilege, isAuthenticated } = useAppAuth()
const siteId = computed(() => {
  const id = parentItem.value?.site?.['@id']
  return id ? Number(extractIdFromIri(id as Iri)) : undefined
})
</script>

<template>
  <data-collection-page
    :path
    :title="`Related ${title}`"
    :show-back-button="!Boolean(parent)"
    :acl="{
      canExport: isAuthenticated,
      canCreate: siteId ? hasSitePrivilege(siteId) : hasAnySitePrivilege,
    }"
  >
    <data-collection-table-join-context-stratigraphic-unit :path :parent />
  </data-collection-page>
</template>
