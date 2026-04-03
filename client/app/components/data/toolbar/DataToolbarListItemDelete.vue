<script setup lang="ts" generic="Path extends DeleteItemPath | GetItemPath">
import type {
  GetItemPath,
  GetItemResponseMap,
  DeleteItemPath,
  OperationPathParams,
} from '~~/types'

const props = defineProps<{
  path: Path
  item: GetItemResponseMap[Path]
}>()

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore(props.path),
)

const setDialogState = () => {
  deleteDialogState.value = {
    id: extractIdFromIri(props.item['@id']),
  } as OperationPathParams<Path, 'delete' | 'get'>
}
</script>

<template>
  <v-list-item
    data-testid="data-toolbar-menu-update-list-item"
    title="delete item"
    @click="setDialogState()"
  >
    <template #prepend>
      <v-icon color="error" icon="fas fa-minus" />
    </template>
  </v-list-item>
</template>
