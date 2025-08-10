<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useSampleValidation'
import { useNormalization } from '~/composables/normalization/useSampleNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/samples/{id}'),
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
    path="/api/data/samples/{id}"
    title="Sample"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-sample
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
