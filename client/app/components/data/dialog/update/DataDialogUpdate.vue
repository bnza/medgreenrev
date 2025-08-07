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

/**
 *
 * Evaluates the presence of both `$errors` and `$silentErrors` within the
 * `regle.value` object to determine the validity of the value. If errors or silent errors
 * exist, the value is considered invalid.
 * It's a workaround function, since sometimes in Playwright tests regle.$invalid is set false
 * even though there are no errors: so it checks for this inconsistency
 * between the `$invalid` property and the overall error states, and logs a warning if
 * a mismatch is detected.
 *
 * Once validated, the regle.$value model should be fine. It's not an actual TS guard
 */
const isValidItem = (value: any): value is PatchItemRequestMap[Path] => {
  const invalid =
    Object.values<string[]>(regle.value.$errors).some(
      (propErrors) => propErrors.length > 0,
    ) &&
    Object.values<string[]>(regle.value.$silentErrors).some(
      (propErrors) => propErrors.length > 0,
    )
  if (invalid !== regle.value.$invalid) {
    console.warn(
      'Regle $invalid value mismatches with $errors and $silentErrors values.',
    )
  }
  return !invalid
}

const submit = async () => {
  await regle.value.$validate()

  if (!isValidItem(regle.value.$value)) {
    addError('Invalid model.')
    console.log('model', toRaw(regle.value.$value))
    return
  }

  if (!isValidItem(item.value) || !('id' in item.value)) {
    addError('Invalid item')
    console.log('item', item.value)
    return
  }

  patchItem.item.value = toRaw(item.value)

  const model = props.onPreSubmit(regle.value.$value)
  try {
    await patchItem.mutateAsync({
      param: {
        id: item.value ? item.value.id : undefined,
      } as OperationPathParams<Path, 'patch'>,
      model: toRaw(model),
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
