<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useContextZooAnalysisValidation'
import { useNormalization } from '~/composables/normalization/useContextZooAnalysisNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/contexts/zoo/{id}'),
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
    path="/api/data/analyses/contexts/zoo/{id}"
    title="Zooarchaeological context analysis"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-context-zoo-analysis
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
