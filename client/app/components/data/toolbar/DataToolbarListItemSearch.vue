<script setup lang="ts" generic="Path extends GetCollectionPath">
import type { GetCollectionPath } from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'

const props = defineProps<{
  path: Path
}>()

const { isSearchDialogOpen: visible } = storeToRefs(
  useResourceUiStore(props.path),
)
</script>

<template>
  <v-list-item
    data-testid="data-toolbar-menu-search-list-item"
    title="advanced search"
    @click="visible = true"
  >
    <template #prepend>
      <v-icon color="primary" icon="fas fa-magnifying-glass-plus" />
    </template>
  </v-list-item>
</template>
