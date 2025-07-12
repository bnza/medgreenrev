<script setup lang="ts" generic="Path extends PatchItemPath">

import type {
  GetItemResponseMap,
  OperationPathParams,
  PatchItemPath,
  PatchItemRequestMap,
  PostCollectionRequestMap,
} from "~~/types";
import useResourceUiStore from "~/stores/resource-ui";
import type {RegleRoot} from "@regle/core";
import usePatchItemMutation from "~/composables/queries/usePatchItemMutation";

const props = defineProps<{
  path: Path
  title: string
  regle: RegleRoot
}>()

defineSlots<{
  default(): any
  actions(): any
}>()

const {isUpdateDialogOpen: visible, updateDialogState} = storeToRefs(useResourceUiStore(props.path))

const {queryOptions} = useDefineGetItemQuery(props.path)
const {data: item, status, error} = useQuery(queryOptions, () => (updateDialogState.value || undefined) as OperationPathParams<Path, 'get'> | undefined)
watch(item, (value) => {
    if (value) {
      props.regle.$value = structuredClone(value)
    }
  },
  {immediate: true}
)

const {patchItem} = usePatchItemMutation(props.path)
const {addSuccess, addError} = useMessagesStore()

const isValidItem = (value: unknown): value is GetItemResponseMap[Path] => {
  return isPlainObject(value) && 'id' in value
}
const isValidOperationPathParams = (params: unknown): params is OperationPathParams<Path, "patch"> => {
  return isValidItem(params) && 'id' in params
}

const submit = async () => {
  await props.regle.$validate()
  const isValidItem = (value: any): value is PatchItemRequestMap[Path] => !props.regle.$invalid

  const runtimeError: string[] = []

  if (!isValidItem(props.regle.$value)) {
    addError('Invalid model.')
    console.log('model', props.regle.$value)
    return
  }

  if (!isValidItem(item.value) || !('id' in item.value)) {
    addError('Invalid item')
    console.log('item', item.value)
    return
  }

  patchItem.item.value = toRaw(item.value)
  try {
    await patchItem.mutateAsync(
      {
        param: {id: item.value?.id} as OperationPathParams<Path, "patch">,
        model: toRaw(props.regle.$value)
      }

    )
    addSuccess('Resource successfully updated')
    visible.value = false
  } catch (e) {
    addError(e)
  }
}
const disabled = computed(() => false)

watch(visible, (flag) => {
  if (!flag) {
    props.regle.$value = {}
    props.regle.$reset()
  }
})
</script>

<template>
  <data-dialog
    v-if="visible"
    data-testid="data-dialog-create"
    :visible
    :title="`Edit (${title})`"
  >
    <template #default>
      <v-form data-testid="data-dialog-form">
        <v-sheet class="ma-4">
          <v-container>
            <slot @submit.prevent/>
          </v-container>
        </v-sheet>
      </v-form>
    </template>
    <template #actions>
      <v-col class="d-flex justify-center">
        <v-btn
          data-testid="data-dialog-form-close-button"
          :disabled
          @click="visible=false"
        >close
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-center">
        <v-btn
          color="secondary"
          data-testid="data-dialog-form-submit-button"
          :disabled
          @click="submit"
        >submit
        </v-btn>
      </v-col>
    </template>
  </data-dialog>
</template>
