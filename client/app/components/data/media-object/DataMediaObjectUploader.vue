<script setup lang="ts">
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'
import type {
  FormDataFields,
  PostCollectionRequestMap,
  PostCollectionResponseMap,
} from '~~/types'
import type { TypedFormData } from '~/api/TypedFormData'
import usePreCreateNormalization from '~/composables/usePreCreateNormalization'

const file = defineModel<File | undefined>('file', { required: true })

const { r$ } = useCollectScope<[FormDataFields<'/api/data/media_objects'>]>()

const { postCollection: mediaObjectPostCollection } = usePostCollectionMutation(
  '/api/data/media_objects',
  { headers: { 'Content-Type': 'multipart/form-data' } },
)

const onPreSubmit = usePreCreateNormalization('mediaObject')
const submit = async (): Promise<
  PostCollectionResponseMap['/api/data/media_objects'] | undefined
> => {
  r$.$reset()
  await nextTick()
  const { data, valid } = await r$.$validate()

  if (!valid) {
    return
  }

  // Data has been validated, so it's supposed to be correct
  const typedFormData = onPreSubmit(data[0]) as TypedFormData<
    PostCollectionRequestMap['/api/data/media_objects']
  >

  // TypedFormData extends FormData, so it works with your existing API
  // Eventual request error will be handled in the parent form
  return mediaObjectPostCollection.mutateAsync({
    model: typedFormData,
  })
}

defineExpose({
  submit,
})

const errors = computed(() =>
  Array.isArray(r$.$errors) && r$.$errors[0]
    ? r$.$errors[0].file
    : // @ts-expect-error regle types are wrong
      r$.$errors.file,
)
</script>

<template>
  <v-container fluid data-testid="data-media-object-uploader">
    <v-row v-for="error of errors" :key="error" dense justify="center">
      <v-col cols="12" sm="6">
        <v-banner
          type="error"
          color="error"
          :text="error"
          icon="fas fa-exclamation-triangle"
        />
      </v-col>
    </v-row>
    <data-item-form-create-media-object :show-file-upload="false" :file />
  </v-container>
</template>
