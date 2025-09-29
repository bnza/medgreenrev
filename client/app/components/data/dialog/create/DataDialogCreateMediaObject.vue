<script
  setup
  lang="ts"
  generic="P extends Extract<GetCollectionPath, '/api/data/media_objects'>"
>
import { useCreateValidation } from '~/composables/validation/useMediaObjectValidation'
import { useNormalization } from '~/composables/normalization/useMediaObjectNormalization'
import type { GetCollectionPath } from '~~/types'

const { getEmptyModel, r$ } = useCreateValidation()

const { onPreCreate: onPreSubmit } = useNormalization()

const emit = defineEmits<{
  refresh: []
}>()

defineProps<{
  path: P
}>()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    :path
    post-path="/api/data/media_objects"
    :on-pre-submit
    :get-empty-model
    :post-request-options="{
      headers: { 'Content-Type': 'multipart/form-data' },
    }"
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-create-media-object
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
      />
    </template>
  </data-dialog-create>
</template>
