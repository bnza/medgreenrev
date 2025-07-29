<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import { useUpdateValidation } from '~/composables/validation/useStratigraphicUnitValidation'
import { useNormalization } from '~/composables/normalization/useStratigraphicUnitNormalization'

const { updateDialogState } = storeToRefs(
  useResourceUiStore('/api/stratigraphic_units/{id}'),
)
const { r$, item } = useUpdateValidation(updateDialogState)

const { onPreUpdate } = useNormalization()
</script>

<template>
  <data-dialog-update
    path="/api/stratigraphic_units/{id}"
    title="Stratigraphic Unit"
    v-model:regle="r$"
    :on-pre-submit="onPreUpdate(item)"
  >
    <template #default>
      <data-item-form-edit-stratigraphic-unit
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
