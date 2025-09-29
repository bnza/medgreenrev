<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/context_stratigraphic_units'
      | '/api/data/stratigraphic_units/{parentId}/contexts'
      | '/api/data/contexts/{parentId}/stratigraphic_units'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useContextStratigraphicUnitValidation'

const props = defineProps<{
  path: P
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
    :path
    post-path="/api/data/context_stratigraphic_units"
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
