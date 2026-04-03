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

const { isAuthenticated } = useAppAuth()
const acl = ref({ canExport: isAuthenticated, canCreate: false })
</script>

<template>
  <data-collection-page
    :parent="Boolean(parent)"
    :path
    :show-back-button="false"
    :acl
  >
    <data-collection-table-sediment-core-depth
      v-model:acl="acl"
      :path
      :parent
    />
  </data-collection-page>
</template>
