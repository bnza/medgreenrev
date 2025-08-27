<script setup lang="ts">
import { createRule, type Maybe, useRegle } from '@regle/core'
import { required, maxValue, withMessage } from '@regle/rules'
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'
import { formatBitSize } from '~/utils'

const props = defineProps<{
  file: File
}>()

const defaultModel = () => ({
  file: props.file,
})

const model = ref<{
  file: File
  type?: string
  description?: string
}>(defaultModel())

const configClientMaxBodySize = useRuntimeConfig().public.clientMaxBodySize
const maxBodySize = parseBitSize(configClientMaxBodySize)

const maxFileSize = createRule({
  type: 'maxFileSize',
  validator: (value: Maybe<File>, maxSize: number) => {
    if (!value) return true
    return value.size <= maxSize
  },
  message: (context) =>
    `File size must not exceed ${configClientMaxBodySize}: ${formatBitSize(context.$value?.size)} given`,
})

const { r$ } = useRegle(model, {
  file: {
    required,
    maxFileSize: maxFileSize(maxBodySize),
  },
  type: {
    required,
  },
})

watch(
  () => props.file,
  () => {
    r$.$value = defaultModel()
    r$.$reset()
  },
)

const { postCollection: mediaObjectPostCollection } = usePostCollectionMutation(
  '/api/data/media_objects',
  { headers: { 'Content-Type': 'multipart/form-data' } },
)

const { createFromObject } = useTypedFormData('/api/data/media_objects')

const submit = async () => {
  await r$.$validate()

  if (r$.$invalid) {
    return
  }

  const typedFormData = createFromObject(r$.$value)

  // TypedFormData extends FormData, so it works with your existing API
  // Eventual request error will be handled in the parent form
  return await mediaObjectPostCollection.mutateAsync({
    model: typedFormData,
  })
}

defineExpose({
  submit,
})
</script>

<template>
  <v-form>
    <v-container fluid>
      <v-row
        v-for="error of r$.$errors.file"
        :key="error"
        dense
        justify="center"
      >
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
  </v-form>
</template>
