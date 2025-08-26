<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/usePotteryAnalysisValidation'
import { useNormalization } from '~/composables/normalization/usePotteryAnalysisNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/potteries/{id}'),
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
    path="/api/data/analyses/potteries/{id}"
    title="Pottery Analysis"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-pottery-analysis
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
