<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/usePotteryValidation'
import { useNormalization } from '~/composables/normalization/usePotteryNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/potteries/{id}'),
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
    path="/api/data/potteries/{id}"
    title="Pottery"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-pottery
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
