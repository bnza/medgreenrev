<script setup lang="ts" generic="Path extends DuplicablePostCollectionPath">
import type { Iri, PostCollectionPath } from '~~/types'
import { useResourceCreateDialogStore } from '~/stores/useResourceCreateDialogStore'
import { useCollectionCanCreate } from '~/composables/useCollectionCanCreate'
import type {DuplicablePostCollectionPath} from "~/utils";

const props = defineProps<{
  path: Path
  item: { '@id': Iri }
}>()

const { createDialogState, redirectOnSuccess } = storeToRefs(
  useResourceCreateDialogStore(props.path),
)

const canCreate = useCollectionCanCreate(props.path)

const duplicate = () => {
  redirectOnSuccess.value = true
  createDialogState.value = props.item['@id']
}
</script>

<template>
  <v-list-item
    v-if="canCreate"
    data-testid="data-toolbar-menu-duplicate-list-item"
    title="duplicate"
    @click="duplicate"
  >
    <template #prepend>
      <v-icon color="primary" icon="far fa-copy" />
    </template>
  </v-list-item>
</template>
