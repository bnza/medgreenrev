<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/potteries'
      | '/api/data/stratigraphic_units/{parentId}/potteries'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import DataCollectionTablePottery from '~/components/data/collection/table/DataCollectionTablePottery.vue'

defineProps<{
  path: P
  parent?: ResourceParent<
    'stratigraphicUnit',
    '/api/data/sample_stratigraphic_units/{id}'
  >
}>()

const { hasAnySitePrivilege, hasSitePrivilege, isAuthenticated } = useAppAuth()
</script>
<template>
  <data-collection-page
    title="Stratigraphic Units"
    :parent="Boolean(parent)"
    :path
    :show-back-button="!Boolean(parent)"
    :acl="{
      canExport: isAuthenticated,
      canCreate: parent?.item.id
        ? hasSitePrivilege(parent.item.id)
        : hasAnySitePrivilege,
    }"
  >
    <data-collection-table-pottery :path :parent />
  </data-collection-page>
</template>
