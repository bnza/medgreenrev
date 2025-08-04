<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/contexts'
      | '/api/data/stratigraphic_units/{parentId}/data_contexts'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?:
    | ResourceParent<'site', '/api/data/sites/{id}'>
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
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
    <data-collection-table-context :path :parent />
  </data-collection-page>
</template>
