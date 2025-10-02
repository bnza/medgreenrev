<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useSedimentCoreDepthValidation'
import { useNormalization } from '~/composables/normalization/useSedimentCoreDepthNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/sediment_core_depths/{id}'),
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
    path="/api/data/sediment_core_depths/{id}"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-sediment-core-depth
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
