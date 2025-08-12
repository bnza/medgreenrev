<script setup lang="ts" generic="P extends PostCollectionPath">
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'
import type { PostCollectionPath, PostCollectionRequestMap } from '~~/types'
import { useRegle } from '@regle/core'
import { required } from '@regle/rules'

const props = defineProps<{
  path: P
  parentIri: string
}>()
const visible = defineModel<boolean>({ required: true })

const { addSuccess, addError } = useMessagesStore()

const { postCollection } = usePostCollectionMutation(props.path)
const { postCollection: mediaObjectPostCollection } = usePostCollectionMutation(
  '/api/data/media_objects',
  { headers: { 'Content-Type': 'multipart/form-data' } },
)

const disabled = ref(false)

const emit = defineEmits<{
  refresh: []
}>()

const file = ref<File>()

const defaultModel = () => ({
  mediaObject: undefined,
  item: props.parentIri,
})
const model = ref<{
  mediaObject?: string
  item: string
}>(defaultModel())

const { r$ } = useRegle(model, {
  mediaObject: {
    required,
  },
})
const submit = async () => {
  try {
    disabled.value = true
    if (!r$.$value.mediaObject && file.value) {
      const formData = new FormData()
      formData.append('file', file.value)
      const mediaObject = await mediaObjectPostCollection.mutateAsync({
        model: formData,
      })
      r$.$value.mediaObject = mediaObject['@id']
    }
    await r$.$validate()
    if (r$.$invalid) {
      return
    }
    const requestModel = toRaw(model.value) as PostCollectionRequestMap[P]
    await postCollection.mutateAsync({ model: requestModel })
    addSuccess('Successfully created media object association')
    emit('refresh')
    visible.value = false
  } catch (e) {
    addError(e)
  } finally {
    disabled.value = false
  }
}

watch(
  () => visible.value,
  (flag) => {
    if (!flag) {
      file.value = undefined
      r$.$value = defaultModel()
      r$.$reset()
    }
  },
)
</script>

<template>
  <data-dialog :visible title="Add media object association">
    <template #default>
      <v-form data-testid="data-dialog-form" class="ma-4">
        <v-container fluid>
          <v-row style="min-height: 60px" justify="center">
            <v-banner
              v-if="r$.$errors.mediaObject && r$.$errors.mediaObject.length > 0"
              class="mt-4"
              type="error"
              icon="fas fa-exclamation-triangle"
              color="error"
              >{{ r$.$errors.mediaObject.join(', ') }}</v-banner
            >
          </v-row>
          <v-file-upload v-model="file" clearable>
            <template #item="{ file: itemFile, props: itemProps }">
              <data-media-object-uploading-file
                v-bind="{
                  file: itemFile,
                  onClickRemove: itemProps['onClick:remove'],
                }"
                :errors="r$.$errors.mediaObject"
                @found="r$.$value.mediaObject = $event"
              />
            </template>
          </v-file-upload>
        </v-container>
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
