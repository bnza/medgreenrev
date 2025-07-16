<script setup lang="ts" generic="Path extends keyof paths">
import type { paths } from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'

const props = defineProps<{
  path: Path
}>()

const { isCreateDialogOpen: visible } = storeToRefs(
  useResourceUiStore(props.path),
)
</script>

<template>
  <v-list-item
    data-testid="data-toolbar-menu-create-list-item"
    title="add new"
    @click="visible = true"
  >
    <template #prepend>
      <v-icon color="error" icon="fas fa-plus" />
    </template>
  </v-list-item>
</template>
