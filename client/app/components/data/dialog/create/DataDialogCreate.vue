<script
  setup
  lang="ts"
  generic="Path extends PostCollectionPath & GetCollectionPath"
>
import type {
  ApiRequestOptions,
  GetCollectionPath,
  paths,
  PostCollectionPath,
  PostCollectionRequestMap,
  PostCollectionResponseMap,
} from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'
import type { RegleRoot } from '@regle/core'
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'
import { TypedFormData } from '~/api/TypedFormData'

type OnPreSubmit<Path extends keyof PostCollectionRequestMap> =
  paths[Path]['post']['requestBody'] extends {
    content: { 'multipart/form-data': any }
  }
    ? <T extends Record<string, any>>(item: T) => TypedFormData<any> | T
    : <T extends Record<string, any>>(item: T) => T

const regle = defineModel<RegleRoot>('regle', { required: true })

const props = withDefaults(
  defineProps<{
    postPath: Path
    path?: GetCollectionPath // Used as resource ui key
    title?: string
    redirectOption?: boolean
    postRequestOptions?: ApiRequestOptions
    onPreSubmit: OnPreSubmit<Path>
    getEmptyModel?: () => Record<string, any>
  }>(),
  {
    redirectOption: true,
    getEmptyModel: () => ({}),
    postRequestOptions: () => ({}),
  },
)

const collectionPath = computed<GetCollectionPath>(
  () => props.path ?? props.postPath,
)

defineSlots<{
  default(): any
  actions(): any
}>()

const { addSuccess, addError } = useMessagesStore()

const emit = defineEmits<{
  success: [
    {
      request: Partial<PostCollectionRequestMap[typeof props.postPath]>
      response: PostCollectionResponseMap[typeof props.postPath]
    },
  ]
  refresh: []
}>()

const { isCreateDialogOpen: visible, redirectToItem } = storeToRefs(
  useResourceUiStore(collectionPath.value),
)
const { postCollection, invalidatedCacheEntries } = usePostCollectionMutation(
  props.postPath,
  props.postRequestOptions,
)

const disabled = ref(false)

// Possible redirect handling
const { fullPath } = useRoute()
const router = useRouter()
const { push } = useHistoryStackStore()
const { appPath, labels } = useResourceConfig(props.postPath)

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

const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

const submit = async () => {
  status.value = 'pending'
  regle.value.$reset()
  await nextTick()

  const { valid, data: postData } = await regle.value.$validate()

  if (!valid) {
    console.log('Form is invalid, stopping submission')
    status.value = 'error'
    return
  }

  const isValidItem = (
    value: any,
  ): value is PostCollectionRequestMap[typeof props.postPath] => {
    return valid
  }

  if (!isValidItem(postData)) return

  const model = props.onPreSubmit(postData)

  try {
    disabled.value = true

    const data = await postCollection.mutateAsync({ model })

    // Eventual side effects are produced/handled by the parent Dialog
    emit('success', {
      request:
        model instanceof TypedFormData
          ? model.toObject()
          : structuredClone(toRaw(model)),
      response: data,
    })

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
    status.value = 'success'

    await nextTick()

    visible.value = false
  } catch (e) {
    addError(e)
    status.value = 'error'
  } finally {
    disabled.value = false
  }
}

watch(visible, async (flag) => {
  if (!flag) {
    regle.value.$value = props.getEmptyModel()
    regle.value.$reset()
    status.value = 'idle'
  }
})

const title = computed(() => props.title || labels[0])
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
              <slot v-if="status !== 'success'" />
              <success-component v-else />
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
