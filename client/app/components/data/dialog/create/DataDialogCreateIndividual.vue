<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/individuals'
      | '/api/data/stratigraphic_units/{parentId}/individuals'
    >
  "
>
import { useCreateValidation } from '~/composables/validation/useIndividualValidation'
import { useNormalization } from '~/composables/normalization/useIndividualNormalization'
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: P
  parent?: ResourceParent<
    'stratigraphicUnit',
    '/api/data/stratigraphic_units/{id}'
  >
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
    post-path="/api/data/individuals"
    :path="path"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-individual
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
