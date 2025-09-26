<script setup lang="ts">
import type { ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useStratigraphicUnitValidation'
import { useNormalization } from '~/composables/normalization/useStratigraphicUnitNormalization'

const props = defineProps<{
  parent?: ResourceParent<'site', '/api/data/sites/{id}'>
}>()

const { getEmptyModel, r$ } = useCreateValidation(props.parent)

const { onPreCreate: onPreSubmit } = useNormalization()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    :parent
    path="/api/data/stratigraphic_units"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-stratigraphic-unit
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
