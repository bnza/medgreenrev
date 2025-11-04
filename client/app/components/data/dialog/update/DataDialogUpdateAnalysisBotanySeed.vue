<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useAnalysisBotanySeedValidation'
import { useNormalization } from '~/composables/normalization/useAnalysisBotanySeedNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/botany/seeds/{id}'),
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
    path="/api/data/analyses/botany/seeds/{id}"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-botany-seed
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
