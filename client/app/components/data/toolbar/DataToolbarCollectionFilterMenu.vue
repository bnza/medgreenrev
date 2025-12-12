<script setup lang="ts" generic="Path extends GetCollectionPath">
import type { GetCollectionPath } from '~~/types'
import useCollectionQueryStore from '~/stores/useCollectionQueryStore'

const props = defineProps<{
  path: Path
}>()
const { unfilteredTotalItems, isFiltered, totalItems } = storeToRefs(
  useCollectionQueryStore(props.path),
)
</script>

<template>
  <v-btn
    data-testid="data-toolbar-collection-filter-menu-button"
    icon="fas fa-filter"
    :color="isFiltered ? 'warning' : 'grey-lighten-1'"
  >
    <v-icon>fas fa-filter</v-icon>
    <v-menu
      activator="parent"
      data-testid="data-toolbar-collection-filter-menu"
      open-on-hover
    >
      <v-list>
        <v-list-item v-if="isFiltered">
          <v-list-item-title>Filtered</v-list-item-title>
          <v-list-item-subtitle
            >{{ totalItems }} of
            {{ unfilteredTotalItems }}</v-list-item-subtitle
          >
        </v-list-item>
        <v-list-item v-else>
          <v-list-item-title>No filter applied</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>
