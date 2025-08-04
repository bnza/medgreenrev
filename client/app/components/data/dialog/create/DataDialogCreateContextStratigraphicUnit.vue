<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/context_stratigraphic_units'
      | '/api/data/contexts/{parentId}/stratigraphic_units'
      | '/api/data/stratigraphic_units/{parentId}/contexts'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useContextStratigraphicUnitValidation'

const props = defineProps<{
  path: Path
  parent?:
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
    | ResourceParent<'context', '/api/data/contexts/{id}'>
}>()

const { getEmptyModel, r$ } = useCreateValidation(props.parent)
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    title="User"
    :parent
    :path
    :on-pre-submit="(item) => item"
    :get-empty-model
  >
    <template #default>
      <data-item-form-edit-context-stratigraphic-unit
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
