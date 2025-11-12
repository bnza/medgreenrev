<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useAnalysisZooToothValidation'
import { useNormalization } from '~/composables/normalization/useBaseNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/zoo/teeth/{id}'),
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
    path="/api/data/analyses/zoo/teeth/{id}"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-subject
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
        subject-path="/api/data/zoo/teeth"
        subject-item-title="code"
        subject-parent-key="zooTooth"
      />
    </template>
  </data-dialog-update>
</template>
