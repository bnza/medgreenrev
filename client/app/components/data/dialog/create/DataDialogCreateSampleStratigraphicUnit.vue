<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/sample_stratigraphic_units'
      | '/api/data/stratigraphic_units/{parentId}/samples'
      | '/api/data/samples/{parentId}/stratigraphic_units'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useSampleStratigraphicUnitValidation'

const props = defineProps<{
  path: Path
  parent?:
    | ResourceParent<'sample', '/api/data/samples/{id}'>
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
}>()

const { getEmptyModel, r$ } = useCreateValidation(props.parent)
const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    title="Context/Stratigraphic Unit association"
    :redirect-option="false"
    :parent
    :path
    :on-pre-submit="(item) => item"
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <data-item-form-edit-sample-stratigraphi-unit
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
