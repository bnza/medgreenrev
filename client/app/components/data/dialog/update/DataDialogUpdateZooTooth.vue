<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useZooToothValidation'
import { useNormalization } from '~/composables/normalization/useZooToothNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/zoo/teeth/{id}'),
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
    path="/api/data/zoo/teeth/{id}"
    title="Zooarchaeology (tooth)"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-zoo-tooth
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
