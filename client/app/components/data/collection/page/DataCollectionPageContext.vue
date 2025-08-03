<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      '/api/contexts' | '/api/stratigraphic_units/{parentId}/contexts'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?:
    | ResourceParent<'site', '/api/sites/{id}'>
    | ResourceParent<'stratigraphicUnit', '/api/stratigraphic_units/{id}'>
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
