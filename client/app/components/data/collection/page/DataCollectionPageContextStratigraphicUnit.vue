<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/context_stratigraphic_units'
      | '/api/stratigraphic_units/{parentId}/data_contexts'
      | '/api/data_contexts/{parentId}/stratigraphic_units'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?:
    | ResourceParent<'stratigraphicUnit', '/api/stratigraphic_units/{id}'>
    | ResourceParent<'context', '/api/data_contexts/{id}'>
}>()
const { siteCollectionAcl: acl } = useAppAuth()
</script>

<template>
  <data-collection-page
    :path
    title="Contexts"
    :show-back-button="!Boolean(parent)"
    :acl
  >
    <data-collection-table-context-stratigraphic-unit :path :parent />
  </data-collection-page>
</template>
