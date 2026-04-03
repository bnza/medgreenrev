<script setup lang="ts">
import type { Filter, SearchableGetCollectionPath } from '~~/types'
import useResourceUiStore from '~/stores/useResourceUiStore'

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

const { filtersMap, filters, isChanged, setFilters, syncFilterMapToState } =
  useCollectionQueryFilters(props.path)

const openFilterDialog = (id: string) => {
  currentFilterId.value = id
  filterDialogVisible.value = true
}

const closeFilterDialog = () => {
  filterDialogVisible.value = false
  currentFilterId.value = undefined
}

const deleteFilter = (id: string) => {
  filtersMap.value.delete(id)
}

const setFilter = (id: string, filter: Filter) => {
  filtersMap.value.set(id, toRaw(filter))
  filterDialogVisible.value = false
  currentFilterId.value = undefined
}

const setFiltersToStore = () => {
  setFilters(filtersMap.value)
  visible.value = false
}

watch(visible, (flag) => {
  if (!flag) {
    filtersMap.value.clear()
  } else {
    syncFilterMapToState()
  }
})
</script>

<template>
  <data-dialog
    data-testid="data-dialog-search"
    :visible
    :title="`Search (${title})`"
  >
    <template #title>
      <p class="text-grey-lighten-1">
        <v-icon
          icon="fas fa-magnifying-glass-plus"
          size="16"
          class="text-primary mx-1"
        />
        <span
          data-testid="data-card-toolbar-main-title"
          class="text-uppercase px-2"
        >
          {{ title }}</span
        >
      </p>
    </template>
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
        :is-changed
        :path
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
            color="white"
            @click="visible = false"
            >close
          </v-btn>
        </template>
        <template #left-two>
          <v-btn
            data-testid="data-dialog-form-clear-button"
            color="white"
            @click="filtersMap.clear()"
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
