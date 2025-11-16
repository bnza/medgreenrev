<script setup lang="ts" generic="Path extends PatchItemPath & GetItemPath">
import type {
  GetItemPath,
  OperationPathParams,
  PatchItemPath,
  PatchItemRequestMap,
  RegleAdapter,
} from '~~/types'

import usePatchItemMutation from '~/composables/queries/usePatchItemMutation'
import usePreUpdateNormalization from '~/composables/usePreUpdateNormalization'

const props = withDefaults(
  defineProps<{
    path: Path
    item: PatchItemRequestMap[Path]
    initialValue?: PatchItemRequestMap[Path]
    regle: RegleAdapter<PatchItemRequestMap[Path]>
    title?: string
    fullscreen?: boolean
  }>(),
  {
    fullscreen: true,
  },
)

const { isUpdateDialogOpen: visible, updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore(props.path),
)

const emit = defineEmits<{
  refresh: []
}>()

const { patchItem } = usePatchItemMutation(props.path)
const { addSuccess, addError } = useMessagesStore()

const submit = async () => {
  props.regle.$reset()
  await nextTick()

  const { valid } = await props.regle.$validate()

  const isValidItem = (value: any): value is PatchItemRequestMap[Path] => {
    return valid
  }

  if (!isValidItem(props.item)) {
    console.log('Form is invalid, stopping submission')
    return
  }

  const id = updateDialogState.value?.id

  if (!id) {
    console.error('Invalid ID, stopping submission')
    return
  }

  if (!props.initialValue) {
    console.error('No initial value provided, stopping submission.')
    return
  }

  const onPreSubmit = usePreUpdateNormalization(props.path)

  const model = toRaw(onPreSubmit(props.initialValue)(props.item))
  try {
    await patchItem.mutateAsync({
      param: {
        id,
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
    props.regle.$reset()
  }
})

const { labels } = useResourceConfig(props.path)
const title = computed(() => props.title || labels[0])

defineSlots<{
  default(): any
  actions(): any
}>()
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
