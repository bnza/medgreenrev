<script setup lang="ts">
import { useCreateValidation } from '~/composables/validation/useSiteValidation'
import { useNormalization } from '~/composables/normalization/useSiteNormalization'

defineProps<{
  parentId?: string
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
    path="/api/data/sites"
    :parent="undefined"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-site
        v-if="r$.$value"
        v-model:item="r$.$value"
        mode="create"
        :errors="r$.$errors"
      />
    </template>
  </data-dialog-create>
</template>
