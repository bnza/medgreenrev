<script setup lang="ts">
import { useCreateValidation } from '~/composables/validation/useMediaObjectValidation'
import { useNormalization } from '~/composables/normalization/useMediaObjectNormalization'

const { getEmptyModel, r$ } = useCreateValidation()

const { onPreCreate: onPreSubmit } = useNormalization()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    path="/api/data/media_objects"
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
