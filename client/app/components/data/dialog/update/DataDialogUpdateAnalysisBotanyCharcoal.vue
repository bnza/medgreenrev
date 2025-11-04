<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useAnalysisBotanyCharcoalValidation'
import { useNormalization } from '~/composables/normalization/useAnalysisBotanyCharcoalNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/botany/charcoals/{id}'),
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
    path="/api/data/analyses/botany/charcoals/{id}"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-botany-charcoal
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
