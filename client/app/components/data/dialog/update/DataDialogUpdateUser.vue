<script setup lang="ts">
import { useNormalization } from '~/composables/normalization/useUserNormalization'
import useResourceUiStore from '~/stores/resource-ui'
import { useUpdateValidation } from '~/composables/validation/useUserValidation'

const { updateDialogState } = storeToRefs(useResourceUiStore('/api/users/{id}'))
const { r$, item } = useUpdateValidation(updateDialogState)

const { onPreUpdate } = useNormalization()
</script>

<template>
  <data-dialog-update
    path="/api/users/{id}"
    title="User"
    v-model:regle="r$"
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
