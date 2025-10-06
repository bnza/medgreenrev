<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useBotanyCharcoalValidation'
import { useNormalization } from '~/composables/normalization/useBotanyCharcoalNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/botany/charcoals/{id}'),
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
    path="/api/data/botany/charcoals/{id}"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-botany-charcoal
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
