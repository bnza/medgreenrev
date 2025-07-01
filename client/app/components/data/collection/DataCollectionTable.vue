<script setup lang="ts" generic="PATH extends keyof CollectionResponses">

import type {CollectionResponses} from "~~/types";
import useCollectionQueryStore from "~/stores/collection-query";
import useCollectionTableHeadersStore from "~/stores/collection-table-headers";

const props = defineProps<{
  operation: PATH
}>()

const {headers} = storeToRefs(useCollectionTableHeadersStore(props.operation))
const queryStore = useCollectionQueryStore(props.operation)

</script>

<template>
  <v-data-table-server
    fixed-footer
    fixed-header
    :headers
    :items="queryStore.items"
    :items-length="queryStore.totalItems"
    :items-per-page="queryStore.pagination.itemsPerPage"
    multi-sort
    :page="queryStore.pagination.page"
    :sort-by="queryStore.pagination.sortBy"
    @update:group-by="queryStore.pagination.groupBy = $event"
    @update:sort-by="queryStore.pagination.sortBy = $event"
    @update:items-per-page="queryStore.pagination.itemsPerPage = $event"
  >
    <!-- https://mokkapps.de/vue-tips/expose-slots-from-a-child-component-->
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name v-bind="slotProps || {}"/>
    </template>
  </v-data-table-server>
</template>

<style scoped>

</style>
