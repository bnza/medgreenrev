<script setup lang="ts" generic="Path extends PatchItemPath | GetItemPath">
import type {
  GetItemPath,
  GetItemResponseMap,
  OperationPathParams,
  PatchItemPath,
} from '~~/types'

const props = defineProps<{
  path: Path
  item: GetItemResponseMap[Path]
}>()

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore(props.path),
)
const setDialogState = () => {
  updateDialogState.value = {
    id: extractIdFromIri(props.item['@id']),
  } as OperationPathParams<Path, 'patch' | 'get'>
}
</script>

<template>
  <v-list-item
    data-testid="data-toolbar-menu-update-list-item"
    title="edit item"
    @click="setDialogState()"
  >
    <template #prepend>
      <v-icon color="success" icon="fas fa-pen-to-square" />
    </template>
  </v-list-item>
</template>
