<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/botany/charcoals'
      | '/api/data/stratigraphic_units/{parentId}/botany/charcoals'
      | '/api/data/archaeological_sites/{parentId}/botany/charcoals'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import DataCollectionTableBotanyCharcoal from '~/components/data/collection/table/DataCollectionTableBotanyCharcoal.vue'

defineProps<{
  path: P
  parent?:
    | ResourceParent<'stratigraphicUnit'>
    | ResourceParent<'archaeologicalSite'>
  filterPath?: GetCollectionPath
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
    :filter-path
  >
    <data-collection-table-botany-charcoal
      v-model:acl="acl"
      :path
      :parent
      :filter-path
    />
  </data-collection-page>
</template>
