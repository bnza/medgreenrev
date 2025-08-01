<script setup lang="ts">
import type { Filter, FilterState, SearchableGetCollectionPath } from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'
import LayoutActionThreeButtons from '~/components/layout/LayoutActionThreeButtons.vue'
import useCollectionQueryStore from '~/stores/collection-query'
import { diff } from 'deep-object-diff'

const props = defineProps<{
  path: SearchableGetCollectionPath
  title: string
}>()

defineSlots<{
  default(): any
  actions(): any
}>()

const { isSearchDialogOpen: visible } = storeToRefs(
  useResourceUiStore(props.path),
)
const currentFilterId = ref<string>()
const filterDialogVisible = ref(false)

const collectionStore = useCollectionQueryStore(props.path)
const { filtersState } = storeToRefs(collectionStore)
const filtersMap = ref(new Map(Object.entries({} as FilterState)))
const filters = computed(() => Object.fromEntries(filtersMap.value.entries()))
const isChanged = computed(
  () => Object.keys(diff(filtersState.value, filters.value)).length > 0,
)

const openFilterDialog = (id: string) => {
  console.log('open filter dialog', id)
  currentFilterId.value = id
  filterDialogVisible.value = true
}

const closeFilterDialog = () => {
  console.log('close filter dialog')
  filterDialogVisible.value = false
  currentFilterId.value = undefined
}

const deleteFilter = (id: string) => {
  console.log('delete filter', id)
  filtersMap.value.delete(id)
}

const setFilter = (id: string, filter: Filter) => {
  console.log('add filter', id, filter)
  filtersMap.value.set(id, filter)
  filterDialogVisible.value = false
  currentFilterId.value = undefined
}

const setFiltersToStore = () => {
  collectionStore.setFilters(filtersMap.value)
  visible.value = false
}

watch(visible, (flag) => {
  if (!flag) {
    filtersMap.value.clear()
  } else {
    filtersMap.value = new Map(Object.entries(filtersState.value))
  }
})
</script>

<template>
  <data-dialog
    data-testid="data-dialog-search"
    :visible
    :title="`Search (${title})`"
  >
    <template #default>
      <layout-action-three-buttons>
        <template #default>
          <v-btn
            data-testid="data-dialog-search-add-filter-button"
            color="white"
            @click="filterDialogVisible = true"
          >
            <template #prepend>
              <v-icon color="error">fas fa-plus</v-icon>
            </template>
            add filter
          </v-btn>
        </template>
      </layout-action-three-buttons>
      <data-dialog-search-filters-list
        :filters
        @delete="deleteFilter"
        @update="openFilterDialog"
      />
      <data-dialog-search-filter
        :visible="filterDialogVisible"
        :filter-id="currentFilterId"
        :path
        :filters
        @update="setFilter"
        @close="closeFilterDialog"
      />
    </template>
    <template #actions>
      <layout-action-three-buttons>
        <template #left-one>
          <v-btn
            data-testid="data-dialog-form-close-button"
            @click="visible = false"
            color="white"
            >close
          </v-btn>
        </template>
        <template #left-two>
          <v-btn
            data-testid="data-dialog-form-clear-button"
            @click="filtersMap.clear()"
            color="white"
            >clear
          </v-btn>
        </template>
        <template #default>
          <v-btn
            data-testid="data-dialog-form-submit-button"
            :disabled="!isChanged"
            @click="setFiltersToStore"
            >submit
          </v-btn>
        </template>
      </layout-action-three-buttons>
    </template>
  </data-dialog>
</template>
