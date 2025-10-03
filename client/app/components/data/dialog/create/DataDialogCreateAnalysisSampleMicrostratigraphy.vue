<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/samples/microstratigraphy'
      | '/api/data/analyses/{parentId}/samples/microstratigraphy'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useAnalysisSampleMicrostratigraphyValidation'
import { useNormalization } from '~/composables/normalization/useAnalysisSampleMicrostratigraphyNormalization'

const props = defineProps<{
  path: P
  parent?:
    | ResourceParent<'sample', '/api/data/samples/{id}'>
    | ResourceParent<'analysis', '/api/data/analyses/{id}'>
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
    :path
    post-path="/api/data/analyses/samples/microstratigraphy"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-sample-microstratigraphy
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
