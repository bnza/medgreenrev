<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useAnalysisZooBoneValidation'
import { useNormalization } from '~/composables/normalization/useBaseNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/zoo/bones/{id}'),
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
    path="/api/data/analyses/zoo/bones/{id}"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-subject
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
        subject-path="/api/data/zoo/bones"
        subject-item-title="code"
        subject-parent-key="zooBone"
      />
    </template>
  </data-dialog-update>
</template>
