<script setup lang="ts" generic="Path extends DeleteItemPath & GetItemPath">
import type {
  DeleteItemPath,
  GetItemPath,
  GetItemResponseMap,
  OperationPathParams,
} from '~~/types'
import useDeleteItemMutation from '~/composables/queries/useDeleteItemMutation'
import useGetItemQuery from '~/composables/queries/useGetItemQuery'

const props = defineProps<{
  path: Path
  title: string
}>()

defineSlots<{
  default(props: { item: GetItemResponseMap[Path] }): any
  actions(): any
}>()

const { isDeleteDialogOpen: visible, deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore(props.path),
)

const {
  data: item,
  status,
  error,
} = useGetItemQuery(props.path, deleteDialogState)
const isValidItem = (value: unknown): value is GetItemResponseMap[Path] => {
  return isPlainObject(value) && 'id' in value
}

const { deleteItem, invalidatedCacheEntries } = useDeleteItemMutation(
  props.path,
)

const disabled = computed(() => false)

const { addError, addSuccess } = useMessagesStore()
const isValidOperationPathParams = (
  params: unknown,
): params is OperationPathParams<Path, 'delete'> => {
  return isValidItem(params) && 'id' in params
}

const emit = defineEmits<{
  deleted: []
  refresh: []
}>()

const submit = async () => {
  if (!isValidOperationPathParams(item.value)) {
    addError(
      `Invalid delete operation params for path "${props.path}`,
      JSON.stringify(item.value),
    )
    return
  }
  try {
    await deleteItem.mutateAsync({
      id: item.value.id,
    } as OperationPathParams<Path, 'delete'>)
    addSuccess('Resource successfully deleted')
    visible.value = false
    emit('deleted')

    // If no cache hits, probably query cache has been deleted
    // so we need to force a refresh of the collection
    if (!invalidatedCacheEntries.value.length) {
      emit('refresh')
    }
  } catch (e) {
    addError(e)
  }
}
</script>

<template>
  <data-dialog
    data-testid="data-dialog-delete"
    :visible
    :title="`Delete (${title})`"
  >
    <template #default>
      <data-dialog-delete-alert />
      <data-item-form-read>
        <loading-component v-if="status === 'pending'" />
        <resource-not-found v-else-if="error" :error :path="props.path" />
        <async-wrapper v-else-if="isValidItem(item)">
          <slot v-bind="{ item }" />
        </async-wrapper>
        <resource-not-found
          v-else
          error="Unsupported item value"
          :path="props.path"
        />
      </data-item-form-read>
    </template>
    <template #actions>
      <v-col class="d-flex justify-center">
        <v-btn
          data-testid="data-dialog-form-close-button"
          :disabled
          @click="visible = false"
          >close
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-center">
        <v-btn
          color="error"
          data-testid="data-dialog-form-submit-button"
          :disabled
          @click="submit"
          >delete
        </v-btn>
      </v-col>
    </template>
  </data-dialog>
</template>
