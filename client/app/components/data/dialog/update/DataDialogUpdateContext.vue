<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useContextValidation'
import { useNormalization } from '~/composables/normalization/useContextNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/contexts/{id}'),
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
    path="/api/data/contexts/{id}"
    title="Context"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-context
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
