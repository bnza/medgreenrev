<script setup lang="ts">
import type { FormDataFields } from '~~/types'
import { createRule, type Maybe, useScopedRegle } from '@regle/core'
import { required, withMessage } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import useMaxFileSizeValidationRule from '~/composables/validation/rules/useMaxFileSizeValidationRule'

type Path = '/api/data/media_objects'

interface Props {
  showFileUpload?: boolean
  file?: File | undefined
}

const props = withDefaults(defineProps<Props>(), { showFileUpload: true })
defineEmits<{
  'update:item': [value: any]
}>()

const model = (
  props.showFileUpload ? {} : { file: props.file }
) as FormDataFields<Path>

const { maxFileSize } = useMaxFileSizeValidationRule()

const apiSha256Validator = new GetValidationOperation(
  '/api/validator/unique/media_objects/sha256',
)

const uniqueFile = createRule({
  validator: async (value: Maybe<File>) =>
    value
      ? await apiSha256Validator.isValid({
          sha256: await calculateSHA256FileHash(value),
        })
      : true,
  message: 'Duplicate file',
})

const { r$ } = useScopedRegle(model, {
  file: {
    required: withMessage(required, 'File is required'),
    uniqueFile,
    maxFileSize,
  },
  type: {
    required,
  },
})

watch(
  () => props.file,
  (value) => {
    r$.$value.file = value!
    if (!value) {
      r$.$reset()
    } else {
      r$.file?.$touch()
    }
  },
  { immediate: !props.showFileUpload },
)
</script>

<template>
  <v-card-text class="px-0">
    <data-media-object-file-errors-banner-row
      :errors="Array.isArray(r$.$errors?.file) ? r$.$errors.file : []"
    />
    <v-row v-if="showFileUpload">
      <v-col cols="12">
        <v-file-upload
          v-model="r$.$value.file"
          clearable
          data-testid="data-dialog-form-file-upload"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <data-autocomplete-hierarchical-vocabulary
          v-model="r$.$value.type"
          path="/api/vocabulary/media_object/types"
          label="type"
          :error-messages="r$.$errors?.type"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="r$.$value.description"
          label="description"
          rows="3"
        />
      </v-col>
    </v-row>
  </v-card-text>
</template>
