<script setup lang="ts">
import { useNormalization } from '~/composables/normalization/useUserNormalization'
import { useUpdateValidation } from '~/composables/validation/useUserValidation'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/admin/users/{id}'),
)
const { r$, item } = useUpdateValidation(updateDialogState)

const { onPreUpdate } = useNormalization()
</script>

<template>
  <data-dialog-update
    v-model:regle="r$"
    path="/api/admin/users/{id}"
    title="User"
    :on-pre-submit="onPreUpdate(item)"
  >
    <template #default>
      <data-item-form-edit-user
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
