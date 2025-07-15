<script setup lang="ts" generic="Path extends PostCollectionPath">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  PostCollectionResponseMap,
} from '~~/types'

import useResourceUiStore from '~/stores/resource-ui'
import type { RegleRoot } from '@regle/core'
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'

type OnPreSubmit = <T>(item: T) => T

const regle = defineModel<RegleRoot>('regle', { required: true })

const props = withDefaults(
  defineProps<{
    path: Path
    title: string
    parentId?: string
    onPreSubmit?: OnPreSubmit
    getEmptyModel?: () => Record<string, any>
  }>(),
  {
    onPreSubmit: <T,>(item: T) => item,
    getEmptyModel: () => ({}),
  },
)

defineSlots<{
  default(): any
  actions(): any
}>()

const emit = defineEmits<{
  success: [
    {
      request: PostCollectionRequestMap[Path]
      response: PostCollectionResponseMap[Path]
    },
  ]
}>()

const { isCreateDialogOpen: visible, redirectToItem } = storeToRefs(
  useResourceUiStore(props.path),
)
const { postCollection } = usePostCollectionMutation(props.path)
const { addSuccess, addError } = useMessagesStore()
const disabled = ref(false)

// Possible redirect handling
const { fullPath } = useRoute()
const router = useRouter()
const { push } = useHistoryStackStore()

const redirectToNewItem = async (newItem: Record<string, any>) => {
  if (!('id' in newItem)) {
    addError('Cannot redirect to new item: missing id.')
    console.error('new item', newItem)
    return
  }
  const id = newItem.id
  const path = `${fullPath}/${id}`
  push(fullPath)
  await router.push(path)
}
// Possible redirect handling

const { buildValidOperationPathParams } = useOpenApiStore()

const submit = async () => {
  await regle.value.$validate()

  // Once validated regle model should be fine. It's not a real TS guard
  const isValidItem = (value: any): value is PostCollectionRequestMap[Path] =>
    !regle.value.$invalid

  if (!isValidItem(regle.value.$value)) return

  const model = props.onPreSubmit(regle.value.$value)

  try {
    disabled.value = true

    const param = buildValidOperationPathParams(
      props.path,
      'post',
      props.parentId ? { parentId: props.parentId } : undefined,
    )

    if (props.parentId && !param) {
      addError('Invalid path params. Check your configuration')
      return
    }
    const data = await postCollection.mutateAsync({ param, model })

    // Eventual side effects are produced/handled by the parent Dialog
    emit('success', { request: structuredClone(toRaw(model)), response: data })

    //The app redirects to the new item page since the user decided so
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
                  v-model="redirectToItem"
                  data-testid="show-created-item-checkbox"
                  label="show created item"
                />
              </v-col>
            </v-row>
            <slot @submit.prevent />
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
