<script
  setup
  lang="ts"
  generic="Path extends PostCollectionPath & ApiResourcePath"
>
import type {
  ApiRequestOptions,
  ApiResourcePath,
  PostCollectionPath,
  PostCollectionRequestMap,
  PostCollectionResponseMap,
  RegleAdapter,
} from '~~/types'
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'
import { TypedFormData } from '~/api/TypedFormData'
import usePreCreateNormalization from '~/composables/usePreCreateNormalization'

const props = withDefaults(
  defineProps<{
    path: Path // Used as a key for useResourceUiStore
    regle: RegleAdapter<PostCollectionRequestMap[Path]>
    item: Partial<PostCollectionRequestMap[Path]>
    title?: string
    redirectOption?: boolean
    postRequestOptions?: ApiRequestOptions
  }>(),
  {
    redirectOption: true,
    postRequestOptions: () => ({}),
  },
)

const { findApiResourceKeyFromPath } = useOpenApiStore()
const resourceKey = findApiResourceKeyFromPath(props.path)

if (!resourceKey) throw new Error(`No resource found for path ${props.path}`)

defineSlots<{
  default(props: {
    duplicateItem: Partial<PostCollectionRequestMap[Path]> | null
  }): any
  actions(): any
}>()

const { addSuccess, addError } = useMessagesStore()

const emit = defineEmits<{
  visible: [boolean]
  success: [
    {
      request: Partial<PostCollectionRequestMap[Path]>
      response: PostCollectionResponseMap[Path]
    },
  ]
  refresh: []
}>()

const {
  isCreateDialogOpen: visible,
  isReady: isCreateDialogReady,
  duplicateSource,
  clonedItem,
  redirectToItem,
  redirectOnSuccess,
} = useCreateDialog(props.path)

const { postCollection, invalidatedCacheEntries } = usePostCollectionMutation(
  props.path,
  props.postRequestOptions,
)

const disabled = ref(false)

// Possible redirect handling
const { fullPath } = useRoute()
const router = useRouter()
const { push } = useHistoryStackStore()
const { appPath, labels } = useResourceConfig(props.path)

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
  ): _value is PostCollectionRequestMap[Path] => {
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
    const shouldRedirect = redirectOnSuccess.value || redirectToItem.value
    if (shouldRedirect) {
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

const baseTitle = computed(() => props.title || labels[0])
const displayTitle = computed(() =>
  duplicateSource.value ? `Duplicate ${baseTitle.value}` : baseTitle.value,
)
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
          {{ displayTitle }}</span
        >
      </p>
    </template>
    <template #default>
      <v-progress-linear
        v-if="!isCreateDialogReady"
        data-testid="data-dialog-create-clone-loader"
        indeterminate
        color="primary"
      />
      <v-form data-testid="data-dialog-form">
        <v-sheet class="ma-4">
          <v-container>
            <v-row class="justify-end">
              <v-col cols="4">
                <v-checkbox
                  v-if="redirectOption && redirectOnSuccess !== true"
                  v-model="redirectToItem"
                  data-testid="show-created-item-checkbox"
                  label="show created item"
                />
              </v-col>
            </v-row>
            <async-wrapper>
              <slot
                v-if="status !== 'success' && isCreateDialogReady"
                :duplicate-item="clonedItem"
              />
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
