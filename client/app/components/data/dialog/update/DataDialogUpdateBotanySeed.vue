<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useBotanySeedValidation'
import { useNormalization } from '~/composables/normalization/useBotanySeedNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/botany/seeds/{id}'),
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
    path="/api/data/botany/seeds/{id}"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-botany-seed
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
