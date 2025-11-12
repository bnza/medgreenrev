<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useAnalysisIndividualValidation'
import { useNormalization } from '~/composables/normalization/useBaseNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/individuals/{id}'),
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
    path="/api/data/analyses/individuals/{id}"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-subject
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
        subject-path="/api/data/individuals"
        subject-item-title="identifier"
        subject-parent-key="individual"
        :disable-analysis-on-subject-parent="false"
        :analysis-query-params="{
          'type.group': [
            AnalysisGroups.MaterialAnalysis,
            AnalysisGroups.Microscope,
            AnalysisGroups.AbsoluteDating,
          ],
          'type.value': ['ANTHRO'],
        }"
      />
    </template>
  </data-dialog-update>
</template>
