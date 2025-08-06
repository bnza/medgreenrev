<script setup lang="ts" generic="Path extends GetCollectionPath">
import type { GetCollectionPath } from '~~/types'
import useCollectionTableHeadersStore from '~/stores/collection-table-headers'

const props = defineProps<{
  path: Path
  parentId?: string
}>()

const { headers } = storeToRefs(useCollectionTableHeadersStore(props.path))

const pathParams = computed(() =>
  props.parentId ? { parentId: props.parentId } : undefined,
)
const { pagination, items, totalItems, status, refetch } =
  useGetCollectionQuery(props.path, pathParams)
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
    @update:options="pagination = $event"
  >
    <!-- https://mokkapps.de/vue-tips/expose-slots-from-a-child-component-->
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name v-bind="slotProps || {}" />
    </template>
  </v-data-table-server>
  <slot name="dialogs" v-bind="{ refetch }" />
</template>
