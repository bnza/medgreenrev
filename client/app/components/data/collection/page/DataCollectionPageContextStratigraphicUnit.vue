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
  parent?:
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
    | ResourceParent<'context', '/api/data/contexts/{id}'>
}>()
const { siteCollectionAcl: acl } = useAppAuth()

const title = computed(() =>
  props.parent?.key === 'stratigraphicUnit'
    ? 'contexts'
    : 'stratigraphic units',
)
</script>

<template>
  <data-collection-page
    :path
    :title="`Related ${title}`"
    :show-back-button="!Boolean(parent)"
    :acl
  >
    <data-collection-table-context-stratigraphic-unit :path :parent />
  </data-collection-page>
</template>
