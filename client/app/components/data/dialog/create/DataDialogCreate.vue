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

const props = withDefaults(
  defineProps<{
    path: Path
    title: string
    regle: RegleRoot
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

const { fullPath, path } = useRoute()
const router = useRouter()
const disabled = ref(false)
const { push } = useHistoryStackStore()

const redirectToNewItem = async (newItem: Record<string, any>) => {
  if (!('id' in newItem)) {
    addError('Cannot redirect to new item')
    console.error('new item', newItem)
    return
  }
  const id = newItem.id
  const path = `${fullPath}/${id}`
  push(fullPath)
  await router.push(path)
}

const submit = async () => {
  await props.regle.$validate()

  // Once validated regle model should be fine. It's not a real TS guard
  const isValidItem = (value: any): value is PostCollectionRequestMap[Path] =>
    !props.regle.$invalid

  if (!isValidItem(props.regle.$value)) return

  const model = props.onPreSubmit(props.regle.$value)

  try {
    disabled.value = true
    const data = await postCollection.mutateAsync(model)

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
    props.regle.$value = props.getEmptyModel()
    props.regle.$reset()
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
                  data-testid="show-created-item-checkbox"
                  label="show created item"
                  v-model="redirectToItem"
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
