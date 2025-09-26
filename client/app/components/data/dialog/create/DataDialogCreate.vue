<script setup lang="ts" generic="Path extends keyof PostCollectionRequestMap">
import type {
  ApiRequestOptions,
  paths,
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
    path: Path
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

const submit = async () => {
  regle.value.$reset()
  await nextTick()

  const { valid, data: postData } = await regle.value.$validate()

  if (!valid) {
    console.log('Form is invalid, stopping submission')
    return
  }

  const isValidItem = (
    value: any,
  ): value is PostCollectionRequestMap[typeof postPath] => {
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
