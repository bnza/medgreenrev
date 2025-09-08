<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/context_samples'
      | '/api/data/samples/{parentId}/contexts'
      | '/api/data/contexts/{parentId}/samples'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: P
  parent?:
    | ResourceParent<'sample', '/api/data/samples/{id}'>
    | ResourceParent<'context', '/api/data/contexts/{id}'>
}>()

const { item: parentItem } = useResourceParent(props.parent)

const title = computed(() =>
  props.parent?.key === 'sample' ? 'contexts' : 'samples',
)

const { hasAnySitePrivilege, hasSitePrivilege, isAuthenticated } = useAppAuth()
const siteId = computed(() => {
  const id = parentItem.value?.site?.['@id']
  return id ? Number(extractIdFromIri(id)) : undefined
})
</script>

<template>
  <data-collection-page
    :title="`Related ${title}`"
    :parent="Boolean(parent)"
    :path
    :show-back-button="!Boolean(parent)"
    :acl="{
      canExport: isAuthenticated,
      canCreate: siteId ? hasSitePrivilege(siteId) : hasAnySitePrivilege,
    }"
  >
    <data-collection-table-join-context-sample :path :parent />
  </data-collection-page>
</template>
