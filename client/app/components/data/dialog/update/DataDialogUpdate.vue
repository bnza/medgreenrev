<script setup lang="ts" generic="Path extends PatchItemPath">
import type {
  OperationPathParams,
  PatchItemPath,
  PatchItemRequestMap,
} from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'
import type { RegleRoot } from '@regle/core'
import usePatchItemMutation from '~/composables/queries/usePatchItemMutation'
import { diff } from 'deep-object-diff'
import useGetItemQuery from '../../../../composables/queries/useGetItemQuery'
import { isApiResourceObject } from '~/utils'

type OnPreSubmit = <T extends object>(oldItem: T, item: T) => Partial<T>

const regle = defineModel<RegleRoot>('regle', { required: true })

const props = withDefaults(
  defineProps<{
    path: Path
    title: string
    fullscreen?: boolean
    onPreSubmit?: OnPreSubmit
  }>(),
  {
    fullscreen: true,
    onPreSubmit: (oldItem: object, item: object) => diff(oldItem, item),
  },
)

defineSlots<{
  default(): any
  actions(): any
}>()

const { isUpdateDialogOpen: visible, updateDialogState } = storeToRefs(
  useResourceUiStore(props.path),
)

const { data: item } = useGetItemQuery(props.path, updateDialogState)

const normalizePatchItem = (item: Record<string, any>) => {
  const normalizedItem = structuredClone(item)
  Object.keys(item).forEach((key) => {
    if (isApiResourceObject(normalizedItem[key])) {
      normalizedItem[key] = normalizedItem[key]['@id']
    }
  })
  return normalizedItem
}

watch(
  item,
  (value) => {
    if (value) {
      regle.value.$value = normalizePatchItem(value)
    }
  },
  { immediate: true },
)

const { patchItem } = usePatchItemMutation(props.path)
const { addSuccess, addError } = useMessagesStore()

const submit = async () => {
  await regle.value.$validate()
  const isValidItem = (value: any): value is PatchItemRequestMap[Path] =>
    !regle.value.$invalid

  if (!isValidItem(regle.value.$value)) {
    addError('Invalid model.')
    console.log('model', regle.value.$value)
    return
  }

  if (!isValidItem(item.value) || !('id' in item.value)) {
    addError('Invalid item')
    console.log('item', item.value)
    return
  }

  patchItem.item.value = toRaw(item.value)

  const model = props.onPreSubmit(item.value, regle.value.$value)
  try {
    await patchItem.mutateAsync({
      param: {
        id: item.value ? item.value.id : undefined,
      } as OperationPathParams<Path, 'patch'>,
      model: toRaw(model),
    })
    addSuccess('Resource successfully updated')
    visible.value = false
  } catch (e) {
    addError(e)
  }
}
const disabled = computed(() => false)

watch(visible, (flag) => {
  if (!flag) {
    regle.value.$value = {}
    regle.value.$reset()
  }
})
</script>

<template>
  <data-dialog
    v-if="visible"
    data-testid="data-dialog-update"
    :fullscreen
    :visible
    :title="`Edit (${title})`"
  >
    <template #default>
      <v-form data-testid="data-dialog-form">
        <v-sheet class="ma-4">
          <v-container>
            <slot />
          </v-container>
        </v-sheet>
      </v-form>
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
