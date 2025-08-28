<script setup lang="ts" generic="Path extends PatchItemPath">
import type {
  OperationPathParams,
  PatchItemPath,
  PatchItemRequestMap,
} from '~~/types'
import type { RegleRoot } from '@regle/core'
import usePatchItemMutation from '~/composables/queries/usePatchItemMutation'

type OnPreSubmit = <T extends Record<string, any>>(item: T) => Partial<T>

const regle = defineModel<RegleRoot>('regle', { required: true })

const props = withDefaults(
  defineProps<{
    path: Path
    title: string
    fullscreen?: boolean
    onPreSubmit: OnPreSubmit
  }>(),
  {
    fullscreen: true,
  },
)

defineSlots<{
  default(): any
  actions(): any
}>()

const emit = defineEmits<{
  refresh: []
}>()

const { isUpdateDialogOpen: visible } = storeToRefs(
  useResourceUpdateDialogStore(props.path),
)

const item = computed(() => regle.value.$value)

const { patchItem } = usePatchItemMutation(props.path)
const { addSuccess, addError } = useMessagesStore()

const submit = async () => {
  regle.value.$reset()
  await nextTick()

  const { valid, data: patchData } = await regle.value.$validate()

  const isValidItem = (value: any): value is PatchItemRequestMap[Path] => {
    return valid
  }

  if (
    !isValidItem(item.value) ||
    !('id' in item.value) ||
    !isValidItem(patchData)
  ) {
    console.log('Form is invalid, stopping submission')
    return
  }

  patchItem.item.value = toRaw(item.value)

  const model = toRaw(props.onPreSubmit(patchData))
  try {
    await patchItem.mutateAsync({
      param: {
        id: item.value ? item.value.id : undefined,
      } as OperationPathParams<Path, 'patch'>,
      model: model,
    })
    addSuccess('Resource successfully updated')
    visible.value = false

    emit('refresh')
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
            <async-wrapper>
              <slot />
            </async-wrapper>
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
