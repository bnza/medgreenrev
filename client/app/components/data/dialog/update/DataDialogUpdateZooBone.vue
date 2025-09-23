<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useZooBoneValidation'
import { useNormalization } from '~/composables/normalization/useZooBoneNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/zoo/bones/{id}'),
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
    path="/api/data/zoo/bones/{id}"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-zoo-bone
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
