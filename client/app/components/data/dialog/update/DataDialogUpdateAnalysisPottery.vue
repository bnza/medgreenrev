<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useAnalysisPotteryValidation'
import { useNormalization } from '~/composables/normalization/useBaseNormalization'

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
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-subject
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
        subject-path="/api/data/potteries"
        subject-item-title="inventory"
        subject-parent-key="pottery"
        :disable-analysis-on-subject-parent="false"
      />
    </template>
  </data-dialog-update>
</template>
