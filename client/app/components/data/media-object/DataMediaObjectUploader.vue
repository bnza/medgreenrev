<script setup lang="ts">
import { useRegle } from '@regle/core'
import { required } from '@regle/rules'
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'
import type { PostCollectionResponseMap } from '~~/types'
import useMaxFileSizeValidationRule from '~/composables/validation/rules/useMaxFileSizeValidationRule'
import { injectMediaObjectJoin } from '~/composables/injection/useMediaObjectJoin'

const { uploadingFile: file, uploadFileValidationPending } =
  injectMediaObjectJoin()

const model = ref<{
  file: File | undefined
  type?: string
  description?: string
}>({
  file: file.value,
})

const { maxFileSize } = useMaxFileSizeValidationRule()

const { r$ } = useRegle(model, {
  file: {
    required,
    maxFileSize,
  },
  type: {
    required,
  },
})

watch(
  () => file.value,
  (value) => {
    model.value.file = value
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

const { createFromObject } = useTypedFormData('/api/data/media_objects')

const submit = async (): Promise<
  PostCollectionResponseMap['/api/data/media_objects'] | undefined
> => {
  r$.$reset()
  const { data, valid } = await r$.$validate()

  if (!valid) {
    return
  }

  const typedFormData = createFromObject(data)

  // TypedFormData extends FormData, so it works with your existing API
  // Eventual request error will be handled in the parent form
  return mediaObjectPostCollection.mutateAsync({
    model: typedFormData,
  })
}

defineExpose({
  submit,
})

watch(
  () => r$.$pending,
  (value) => {
    uploadFileValidationPending.value = value
  },
)
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
    <v-row dense>
      <v-col cols="12" sm="6">
        <data-autocomplete-hierarchical-vocabulary
          v-model="r$.$value.type"
          path="/api/vocabulary/media_object/types"
          label="type"
          :error-messages="r$.$errors.type"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-textarea v-model="r$.$value.description" label="description" />
      </v-col>
    </v-row>
  </v-container>
</template>
