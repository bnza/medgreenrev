<script setup lang="ts" generic="Path extends SearchableGetCollectionPath">
import type { SearchableGetCollectionPath } from '~~/types/filters'
import useResourceUiStore from '~/stores/resource-ui'
import LayoutActionThreeButtons from '~/components/layout/LayoutActionThreeButtons.vue'

const props = defineProps<{
  path: Path
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
const { getPathFilters } = useFilterConfig(props.path)
console.log(getPathFilters())
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
      <data-dialog-search-filter
        v-model:visible="filterDialogVisible"
        v-model:id="currentFilterId"
        :path
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
            data-testid="data-dialog-form-close-button"
            @click="visible = false"
            color="white"
            >clear
          </v-btn>
        </template>
        <template #default>
          <v-btn
            data-testid="data-dialog-form-close-button"
            @click="visible = false"
            >submit
          </v-btn>
        </template>
      </layout-action-three-buttons>
    </template>
  </data-dialog>
</template>
