<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useSiteValidation'
import { useNormalization } from '~/composables/normalization/useSiteNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/sites/{id}'),
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
    path="/api/data/sites/{id}"
    title="Site"
    :on-pre-submit="onPreUpdate(item)"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-site
        v-if="r$.$value"
        v-model:item="r$.$value"
        mode="update"
        :errors="r$.$errors"
      />
    </template>
  </data-dialog-update>
</template>
