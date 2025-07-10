<script setup lang="ts" generic="Path extends GetCollectionPath">
import type {GetCollectionPath, CollectionAcl} from "~~/types";

defineProps<{
  acl: CollectionAcl
  path: Path
}>()
</script>

<template>
  <v-btn
    data-testid="data-toolbar-collection-action-menu-button"
    icon
  >
    <v-icon>fas fa-ellipsis-vertical</v-icon>
    <v-menu
      activator="parent"
      data-testid="data-toolbar-collection-action-menu"
    >
      <v-list>
        <data-toolbar-list-item-search :path/>
      </v-list>
    </v-menu>
  </v-btn>
</template>

