<script setup lang="ts" generic="Path extends keyof paths">
import type {
  paths,
  PostCollectionRequestMap,
  PostCollectionResponseMap,
} from '~~/types'

import useResourceUiStore from '~/stores/resource-ui'
import type { RegleRoot } from '@regle/core'
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'
import useResourceConfig from '~/stores/resource-config'

type OnPreSubmit = <T>(item: T) => T

const regle = defineModel<RegleRoot>('regle', { required: true })

const props = withDefaults(
  defineProps<{
    path: Path
    title: string
    redirectOption?: boolean
    onPreSubmit?: OnPreSubmit
    getEmptyModel?: () => Record<string, any>
  }>(),
  {
    redirectOption: true,
    onPreSubmit: <T,>(item: T) => item,
    getEmptyModel: () => ({}),
  },
)

defineSlots<{
  default(): any
  actions(): any
}>()

const { addSuccess, addError } = useMessagesStore()
const { findApiResourcePath, isPostOperation } = useOpenApiStore()

const postPath = findApiResourcePath(props.path)
if (!isPostOperation(postPath)) {
  addError(`${props.path} is not a valid post path.`)
  throw new Error(`${props.path} is not a valid post path.`)
}

const emit = defineEmits<{
  success: [
    {
      request: PostCollectionRequestMap[typeof postPath]
      response: PostCollectionResponseMap[typeof postPath]
    },
  ]
  refresh: []
}>()

const { isCreateDialogOpen: visible, redirectToItem } = storeToRefs(
  useResourceUiStore(props.path),
)
const { postCollection, invalidatedCacheEntries } =
  usePostCollectionMutation(postPath)

const disabled = ref(false)

// Possible redirect handling
const { fullPath } = useRoute()
const router = useRouter()
const { push } = useHistoryStackStore()
const { appPath } = useResourceConfig(props.path)

const redirectToNewItem = async (newItem: Record<string, any>) => {
  if (!('id' in newItem)) {
    addError('Cannot redirect to new item: missing id.')
    console.error('new item', newItem)
    return
  }
  const id = newItem.id
  const redirectPath = `${appPath}/${id}`
  push(fullPath)
  await router.push(redirectPath)
}
// Possible redirect handling

const submit = async () => {
  try {
    await regle.value.$validate()
  } catch (e) {
    addError('Unexpected validation error')
    console.error(e)
    return
  }

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
  const isValidItem = (
    value: any,
  ): value is PostCollectionRequestMap[typeof postPath] => {
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

  if (!isValidItem(regle.value.$value)) return

  const model = props.onPreSubmit(regle.value.$value)

  try {
    disabled.value = true

    const data = await postCollection.mutateAsync({ model })

    // Eventual side effects are produced/handled by the parent Dialog
    emit('success', { request: structuredClone(toRaw(model)), response: data })

    // If no cache hits, probably query cache has been deleted
    // so we need to force a refresh of the collection
    if (!invalidatedCacheEntries.value.length) {
      emit('refresh')
    }

    //The app will redirect to the new item page since the user decided so
    if (redirectToItem.value) {
      await redirectToNewItem(data)
    }

    addSuccess('Resource successfully created')
    visible.value = false
  } catch (e) {
    addError(e)
  } finally {
    disabled.value = false
  }
}

watch(visible, (flag) => {
  if (!flag) {
    regle.value.$value = props.getEmptyModel()
    regle.value.$reset()
  }
})
</script>

<template>
  <data-dialog
    v-if="visible"
    data-testid="data-dialog-create"
    :visible
    :title="`New (${title})`"
  >
    <template #default>
      <v-form data-testid="data-dialog-form">
        <v-sheet class="ma-4">
          <v-container>
            <v-row justify="end">
              <v-col cols="4">
                <v-checkbox
                  v-if="redirectOption"
                  v-model="redirectToItem"
                  data-testid="show-created-item-checkbox"
                  label="show created item"
                />
              </v-col>
            </v-row>
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
