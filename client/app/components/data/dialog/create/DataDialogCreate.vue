<script
  setup
  lang="ts"
  generic="Path extends PostCollectionPath & ApiResourcePath"
>
import type {
  ApiRequestOptions,
  ApiResourcePath,
  GetCollectionPath,
  PostCollectionPath,
  PostCollectionRequestMap,
  PostCollectionResponseMap,
  RegleAdapter,
} from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'
import { TypedFormData } from '~/api/TypedFormData'
import { API_RESOURCE_MAP } from '~/utils/consts/resources'
import usePreCreateNormalization from '~/composables/usePreCreateNormalization'

const props = withDefaults(
  defineProps<{
    path: GetCollectionPath // Used as a key for useResourceUiStore
    regle: RegleAdapter<PostCollectionRequestMap[Path]>
    item: PostCollectionRequestMap[Path]
    title?: string
    redirectOption?: boolean
    postRequestOptions?: ApiRequestOptions
  }>(),
  {
    redirectOption: true,
    postRequestOptions: () => ({}),
  },
)

const { findApiResourceKeyFromPath, isPostOperationPath } = useOpenApiStore()
const resourceKey = findApiResourceKeyFromPath(props.path)

if (!resourceKey) throw new Error(`No resource found for path ${props.path}`)

const postPath = isPostOperationPath(props.path)
  ? props.path
  : (API_RESOURCE_MAP[resourceKey] as Path)

defineSlots<{
  default(): any
  actions(): any
}>()

const { addSuccess, addError } = useMessagesStore()

const emit = defineEmits<{
  visible: [boolean]
  success: [
    {
      request: Partial<PostCollectionRequestMap[typeof postPath]>
      response: PostCollectionResponseMap[typeof postPath]
    },
  ]
  refresh: []
}>()

const { isCreateDialogOpen: visible, redirectToItem } = storeToRefs(
  useResourceUiStore(props.path),
)

const { postCollection, invalidatedCacheEntries } = usePostCollectionMutation(
  postPath,
  props.postRequestOptions,
)

const disabled = ref(false)

// Possible redirect handling
const { fullPath } = useRoute()
const router = useRouter()
const { push } = useHistoryStackStore()
const { appPath, labels } = useResourceConfig(postPath)

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

const onPreSubmit = usePreCreateNormalization(resourceKey)

const submit = async () => {
  status.value = 'pending'
  props.regle.$reset()
  await nextTick()

  const { valid } = await props.regle.$validate()

  if (!valid) {
    console.log('Form is invalid, stopping submission')
    status.value = 'error'
    return
  }

  const isValidItem = (
    _value: any,
  ): _value is PostCollectionRequestMap[typeof postPath] => {
    return valid
  }

  if (!isValidItem(props.item)) return

  const model = onPreSubmit(structuredClone(toRaw(props.item)))

  try {
    disabled.value = true

    const data = await postCollection.mutateAsync({ model })

    status.value = 'success'

    await nextTick()

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
    props.regle.$reset({ toOriginalState: true })
    status.value = 'idle'
  }
  emit('visible', flag)
})

const title = computed(() => props.title || labels[0])
</script>

<template>
  <data-dialog v-if="visible" data-testid="data-dialog-create" :visible>
    <template #title>
      <p class="text-grey-lighten-1">
        <v-icon icon="fas fa-plus" size="16" class="text-primary mx-1" />
        <span
          data-testid="data-card-toolbar-main-title"
          class="text-uppercase px-2"
        >
          {{ title }}</span
        >
      </p>
    </template>
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
