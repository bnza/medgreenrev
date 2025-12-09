<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/zoo/bones'
      | '/api/data/stratigraphic_units/{parentId}/zoo/bones'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import DataCollectionTableZooBone from '~/components/data/collection/table/DataCollectionTableZooBone.vue'

defineProps<{
  path: P
  parent?: ResourceParent<'stratigraphicUnit'>
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
    <data-collection-table-zoo-bone v-model:acl="acl" :path :parent />
  </data-collection-page>
</template>
