<script setup lang="ts" generic="Path extends GetCollectionPath">
import type {GetCollectionPath} from "~~/types";
import useCollectionTableHeadersStore from "~/stores/collection-table-headers";
import useAppQuerySite from "~/composables/queries/useAppQuerySite";
import useAppQueryUser from "~/composables/queries/useAppQueryUser";

const props = defineProps<{
  path: Path
}>()

const {headers} = storeToRefs(useCollectionTableHeadersStore(props.path))

// Map of operations to their corresponding composables
const queryComposableMap = {
  '/api/sites': useAppQuerySite,
  '/api/users': useAppQueryUser,
  // Add other operations as needed
} as const

// Get the appropriate composable based on operation
const getQueryComposable = () => {
  const composable = queryComposableMap[props.path as keyof typeof queryComposableMap]
  if (!composable) {
    throw new Error(`No query composable found for path: ${props.path}`)
  }
  return composable()
}

const {useGetCollection} = getQueryComposable()
const {pagination, items, totalItems, status} = useGetCollection()

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
      <slot :name v-bind="slotProps || {}"/>
    </template>
  </v-data-table-server>
</template>
