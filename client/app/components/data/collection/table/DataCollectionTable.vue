<script setup lang="ts" generic="Path extends GetCollectionPath">
import type { GetCollectionPath } from '~~/types'
import useCollectionTableHeadersStore from '~/stores/collection-table-headers'

const props = defineProps<{
  path: Path
}>()

const { headers } = storeToRefs(useCollectionTableHeadersStore(props.path))

const { useGetCollection } = useDefineGetCollectionQuery(props.path)
const { pagination, items, totalItems, status } = useGetCollection()
</script>

<template>
  <v-data-table-server
    data-testid="data-collection-table"
    fixed-footer
    fixed-header
    :headers
    :items
    :items-length="totalItems"
    :items-per-page="pagination.itemsPerPage"
    :loading="status === 'pending'"
    multi-sort
    :page="pagination.page"
    :sort-by="pagination.sortBy"
    @update:group-by="pagination.groupBy = $event"
    @update:sort-by="pagination.sortBy = $event"
    @update:items-per-page="pagination.itemsPerPage = $event"
  >
    <!-- https://mokkapps.de/vue-tips/expose-slots-from-a-child-component-->
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name v-bind="slotProps || {}" />
    </template>
  </v-data-table-server>
  <slot name="dialogs" />
</template>
