<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      '/api/stratigraphic_units' | '/api/sites/{parentId}/stratigraphic_units'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useStratigraphicUnitValidation'
import { useNormalization } from '~/composables/normalization/useStratigraphicUnitNormalization'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'site', '/api/sites/{id}'>
}>()

const { getEmptyModel, r$ } = useCreateValidation(props.parent)

const { onPreCreate: onPreSubmit } = useNormalization()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    title="User"
    :parent
    :path
    :on-pre-submit
    :get-empty-model
  >
    <template #default>
      <data-item-form-edit-stratigraphic-unit
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
