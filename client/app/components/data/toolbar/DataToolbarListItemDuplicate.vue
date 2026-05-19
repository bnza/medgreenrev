<script setup lang="ts" generic="Path extends PostCollectionPath">
import type { Iri, PostCollectionPath } from '~~/types'
import { useResourceCreateDialogStore } from '~/stores/useResourceCreateDialogStore'

const props = defineProps<{
  path: Path
  item: { '@id': Iri }
}>()

const { createDialogState } = storeToRefs(
  useResourceCreateDialogStore(props.path),
)

const duplicate = () => {
  createDialogState.value = props.item['@id']
}
</script>

<template>
  <v-list-item
    data-testid="data-toolbar-menu-duplicate-list-item"
    title="duplicate"
    @click="duplicate"
  >
    <template #prepend>
      <v-icon color="primary" icon="far fa-copy" />
    </template>
  </v-list-item>
</template>
