<script setup lang="ts" generic="Path extends GetCollectionPath">
import type { GetCollectionPath } from '~~/types'

const props = defineProps<{
  path: Path
}>()

const { visible } = storeToRefs(useResourceDownloadDialogStore(props.path))
</script>

<template>
  <v-list-item
    data-testid="data-toolbar-menu-download-list-item"
    title="download"
    @click="visible = true"
  >
    <template #prepend>
      <v-icon color="primary" icon="fas fa-download" />
    </template>
  </v-list-item>
</template>
