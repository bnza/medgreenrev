<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/microstratigraphic_units'
      | '/api/data/stratigraphic_units/{parentId}/microstratigraphic_units'
      | '/api/data/samples/{parentId}/microstratigraphic_units'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

defineProps<{
  path: P
  parent?: ResourceParent<'stratigraphicUnit'> | ResourceParent<'sample'>
}>()

const { isAuthenticated } = useAppAuth()
const acl = ref({ canExport: isAuthenticated, canCreate: false })
</script>
<template>
  <data-collection-page
    :parent="Boolean(parent)"
    :path
    :show-back-button="!Boolean(parent)"
    :acl
  >
    <data-collection-table-microstratigraphic-unit
      v-model:acl="acl"
      :path
      :parent
    />
  </data-collection-page>
</template>
