<script setup lang="ts">
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'
import type {
  PostCollectionRequestMap,
  PostCollectionResponseMap,
} from '~~/types'
import { useCreateValidation } from '~/composables/validation/useMediaObjectValidation'
import { useNormalization } from '~/composables/normalization/useMediaObjectNormalization'
import type { TypedFormData } from '~/api/TypedFormData'

const file = defineModel<File | undefined>('file', { required: true })

const { r$ } = useCreateValidation()
const { onPreCreate: onPreSubmit } = useNormalization()

watch(
  () => file.value,
  (value) => {
    r$.$value.file = value
    if (!value) {
      r$.$reset()
    } else {
      r$.file.$touch()
    }
  },
  { immediate: true },
)

const { postCollection: mediaObjectPostCollection } = usePostCollectionMutation(
  '/api/data/media_objects',
  { headers: { 'Content-Type': 'multipart/form-data' } },
)

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
  const typedFormData = onPreSubmit(data) as TypedFormData<
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
</script>

<template>
  <v-container fluid data-testid="data-media-object-uploader">
    <v-row v-for="error of r$.$errors.file" :key="error" dense justify="center">
      <v-col cols="12" sm="6">
        <v-banner
          type="error"
          color="error"
          :text="error"
          icon="fas fa-exclamation-triangle"
        />
      </v-col>
    </v-row>
    <data-item-form-create-media-object
      :item="r$.$value"
      :errors="r$.$errors"
      :show-file-upload="false"
    />
  </v-container>
</template>
