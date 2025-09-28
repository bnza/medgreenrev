<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useAnalysisSampleMicrostratigraphicUnitValidation'
import { useNormalization } from '~/composables/normalization/useAnalysisSampleMicrostratigraphicUnitNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore(
    '/api/data/analyses/samples/microstratigraphic_units/{id}',
  ),
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
    path="/api/data/analyses/samples/microstratigraphic_units/{id}"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-sample-microstratigraphic-unit
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
