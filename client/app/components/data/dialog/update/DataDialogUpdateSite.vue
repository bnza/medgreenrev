<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useSiteValidation'
import { useNormalization } from '~/composables/normalization/useSiteNormalization'
import useResourceUiStore from '~/stores/resource-ui'

const { updateDialogState } = storeToRefs(
  useResourceUiStore('/api/data/sites/{id}'),
)
const { r$, item } = useUpdateValidation(updateDialogState)

const { onPreUpdate } = useNormalization()
</script>

<template>
  <data-dialog-update
    v-model:regle="r$"
    path="/api/data/sites/{id}"
    title="Site"
    :on-pre-submit="onPreUpdate(item)"
  >
    <template #default>
      <data-item-form-edit-site
        v-if="r$.$value"
        v-model:item="r$.$value"
        mode="update"
        :errors="r$.$errors"
      />
    </template>
  </data-dialog-update>
</template>
