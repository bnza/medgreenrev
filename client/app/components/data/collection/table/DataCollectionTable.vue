<script setup lang="ts" generic="Path extends GetCollectionPath">
import type { CollectionAcl, GetCollectionPath } from '~~/types'
import useCollectionTableHeadersStore from '~/stores/collection-table-headers'
import useGetCollectionTotalItemQuery from '~/composables/queries/useGetCollectionTotalItemQuery'

const props = defineProps<{
  path: Path
  parentId?: string
}>()

const { headers } = storeToRefs(useCollectionTableHeadersStore(props.path))

const pathParams = computed(() =>
  props.parentId ? { parentId: props.parentId } : undefined,
)

const {
  acl,
  pagination,
  items,
  totalItems,
  status,
  refetch: refetchFiltered,
} = useGetCollectionQuery(props.path, pathParams)

const { refetch: refetchUnfiltered } = useGetCollectionTotalItemQuery(
  props.path,
  pathParams,
)

refetchUnfiltered()

const refetch = () => {
  refetchFiltered()
  refetchUnfiltered()
}

const { tableHeightPx } = useResponsiveTable({
  excludeSelectors: ['.v-toolbar'],
  fixedOffset: 120,
  minHeight: 350,
})

const { statusChanged } = useAppAuth()
watch(
  () => statusChanged.value,
  () => {
    console.log('statusChanged: refetching data')
    refetch()
  },
)

const emit = defineEmits<{
  acl: [CollectionAcl]
}>()

watch(
  () => acl.value,
  (acl) => emit('acl', acl),
)
</script>

<template>
  <v-data-table-server
    class="overflow-x-auto"
    data-testid="data-collection-table"
    fixed-footer
    fixed-header
    :headers
    :items
    :items-length="totalItems"
    :items-per-page="pagination.itemsPerPage"
    :items-per-page-options="[10, 25, 50, 100]"
    :loading="status === 'pending'"
    :height="parentId ? '350px' : tableHeightPx"
    multi-sort
    striped="odd"
    :page="pagination.page"
    :sort-by="pagination.sortBy"
    :search="pagination.search"
    @update:options="pagination = $event"
  >
    <!-- https://mokkapps.de/vue-tips/expose-slots-from-a-child-component-->
    <template v-for="(_index, name) in $slots" #[name]="slotProps">
      <slot :name v-bind="slotProps || {}" />
    </template>
  </v-data-table-server>
  <slot name="dialogs" v-bind="{ refetch }" />
</template>
