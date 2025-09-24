<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/data/media_objects'>"
>
import type { GetCollectionPath } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useMediaObjectValidation'
import { useNormalization } from '~/composables/normalization/useMediaObjectNormalization'

defineProps<{
  path: Path
}>()

const { getEmptyModel, r$ } = useCreateValidation()

const { onPreCreate: onPreSubmit } = useNormalization()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    :path
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
