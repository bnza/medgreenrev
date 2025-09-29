<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useIndividualValidation'
import { useNormalization } from '~/composables/normalization/useIndividualNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/individuals/{id}'),
)
const { r$, item } = useUpdateValidation(updateDialogState)

const { onPreUpdate } = useNormalization()

defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-update
    v-model:regle="r$"
    path="/api/data/individuals/{id}"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-individual
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
