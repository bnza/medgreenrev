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

const { isCreateDialogOpen: visible } = storeToRefs(
  useResourceUiStore(props.path),
)
const { postCollection } = usePostCollectionMutation(props.path)
const { addSuccess, addError } = useMessagesStore()

const submit = async () => {
  await props.regle.$validate()
  const isValidItem = (value: any): value is PostCollectionRequestMap[Path] =>
    !props.regle.$invalid

  if (!isValidItem(props.regle.$value)) return

  const model = props.onPreSubmit(props.regle.$value)

  try {
    const data = await postCollection.mutateAsync(model)
    emit('success', { request: structuredClone(toRaw(model)), response: data })
    addSuccess('Resource successfully created')
    visible.value = false
  } catch (e) {
    addError(e)
  }
}
const disabled = computed(() => false)

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
