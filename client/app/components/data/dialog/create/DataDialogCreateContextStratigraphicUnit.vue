<script setup lang="ts">
import type { ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useContextStratigraphicUnitValidation'

const props = defineProps<{
  parent?:
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
    | ResourceParent<'context', '/api/data/contexts/{id}'>
}>()

const { getEmptyModel, r$ } = useCreateValidation(props.parent)
const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    :redirect-option="false"
    :parent
    path="/api/data/context_stratigraphic_units"
    :on-pre-submit="(item) => item"
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-context-stratigraphic-unit
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
